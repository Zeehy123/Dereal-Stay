from rest_framework import serializers

from .models import Cancellation


class CancellationSerializer(serializers.ModelSerializer):
    reservation_number = serializers.CharField(source="reservation.reservation_number", read_only=True)

    class Meta:
        model = Cancellation
        fields = "__all__"
        read_only_fields = ["amount_paid", "cancelled_by"]
