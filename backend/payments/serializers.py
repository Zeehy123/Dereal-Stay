from django.utils import timezone
from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    receipt_no = serializers.CharField(read_only=True)
    reservation_number = serializers.CharField(source="reservation.reservation_number", read_only=True)
    guest_name = serializers.SerializerMethodField()
    room_number = serializers.CharField(source="reservation.room.room_number", read_only=True)
    staff_name = serializers.SerializerMethodField()
    payment_type = serializers.SerializerMethodField()
    payment_date = serializers.DateField(required=False)

    class Meta:
        model = Payment
        fields = "__all__"
        read_only_fields = ["recorded_by"]

    def get_guest_name(self, obj):
        return str(obj.reservation.guest)

    def get_staff_name(self, obj):
        u = obj.recorded_by
        return (u.get_full_name() or u.username) if u else None

    def get_payment_type(self, obj):
        res = obj.reservation
        if obj.amount >= res.total_amount:
            return "Full Payment"
        if res.balance <= 0:
            return "Balance"
        return "Part Payment"

    def validate(self, attrs):
        reservation = attrs.get("reservation") or self.instance.reservation
        amount = attrs.get("amount", getattr(self.instance, "amount", None))
        if amount is not None and amount <= 0:
            raise serializers.ValidationError({"amount": "Amount must be greater than zero."})
        if reservation.status == "CANCELLED":
            raise serializers.ValidationError("Cannot take payment on a cancelled reservation.")
        already = reservation.payments.exclude(pk=getattr(self.instance, "pk", None))
        paid = sum(p.amount for p in already)
        if amount is not None and paid + amount > reservation.total_amount:
            raise serializers.ValidationError({"amount": "Payment exceeds the outstanding balance."})
        attrs.setdefault("payment_date", timezone.localdate())
        return attrs
