from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from .models import Guest


class GuestSerializer(serializers.ModelSerializer):
    # Read-only summary fields shown in the guest table.
    reservations_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    last_visit = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Guest
        fields = "__all__"

    def get_reservations_count(self, obj):
        return obj.reservations.exclude(status="CANCELLED").count()

    def get_total_spent(self, obj):
        return obj.reservations.aggregate(t=Sum("amount_paid"))["t"] or 0

    def _last(self, obj):
        return obj.reservations.exclude(status="CANCELLED").order_by("-check_in_date").first()

    def get_last_visit(self, obj):
        last = self._last(obj)
        return last.check_in_date if last else None

    def get_status(self, obj):
        last = self._last(obj)
        if last and last.check_out_date >= (timezone.localdate() - timedelta(days=180)):
            return "ACTIVE"
        return "INACTIVE"
