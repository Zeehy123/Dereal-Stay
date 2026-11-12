from datetime import date
from decimal import Decimal

from rest_framework import serializers

from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    guest_name = serializers.SerializerMethodField()
    guest_detail = serializers.SerializerMethodField()
    room_number = serializers.CharField(source="room.room_number", read_only=True)
    room_type = serializers.CharField(source="room.room_type", read_only=True)
    price_per_night = serializers.DecimalField(
        source="room.price_per_night", max_digits=12, decimal_places=2, read_only=True
    )
    staff_name = serializers.SerializerMethodField()
    # Optional deposit taken at booking time; stored as a real Payment record.
    initial_payment = serializers.DecimalField(
        max_digits=12, decimal_places=2, write_only=True, required=False, min_value=Decimal("0")
    )

    class Meta:
        model = Reservation
        fields = "__all__"
        read_only_fields = [
            "reservation_number", "duration_of_stay", "total_amount", "amount_paid",
            "balance", "date_of_payment", "staff_on_duty", "reservation_date",
        ]

    def get_guest_name(self, obj):
        return str(obj.guest)

    def get_guest_detail(self, obj):
        g = obj.guest
        return {"name": str(g), "phone": g.phone_number, "email": g.email, "address": g.address}

    def get_staff_name(self, obj):
        return (obj.staff_on_duty.get_full_name() or obj.staff_on_duty.username) if obj.staff_on_duty else None

    def validate(self, attrs):
        inst = self.instance
        check_in = attrs.get("check_in_date", inst.check_in_date if inst else None)
        check_out = attrs.get("check_out_date", inst.check_out_date if inst else None)
        room = attrs.get("room", inst.room if inst else None)
        guests = attrs.get("number_of_guests", inst.number_of_guests if inst else 1)
        status = attrs.get("status", inst.status if inst else Reservation.ReservationStatus.PENDING)

        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError({"check_out_date": "Check-out must be after check-in."})

        # Only block past dates when creating or moving the dates.
        dates_changed = inst is None or (
            check_in != inst.check_in_date or check_out != inst.check_out_date
        )
        if check_in and dates_changed and check_in < date.today():
            raise serializers.ValidationError({"check_in_date": "Cannot book past dates."})

        if room and guests and guests > room.capacity:
            raise serializers.ValidationError(
                {"number_of_guests": f"Room {room.room_number} sleeps at most {room.capacity}."}
            )

        if room and check_in and check_out and status in Reservation.ACTIVE_STATUSES:
            clash = Reservation.objects.filter(
                room=room,
                status__in=Reservation.ACTIVE_STATUSES,
                check_in_date__lt=check_out,
                check_out_date__gt=check_in,
            )
            if inst:
                clash = clash.exclude(pk=inst.pk)
            if clash.exists():
                raise serializers.ValidationError("Room is already booked for the selected dates.")

        if room and inst is None and room.status == "MAINTENANCE":
            raise serializers.ValidationError({"room": "This room is under maintenance."})

        return attrs
