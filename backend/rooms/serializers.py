from rest_framework import serializers

from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    # The UI calls capacity "max_guests".
    max_guests = serializers.IntegerField(source="capacity", min_value=1)
    current_guest = serializers.SerializerMethodField()
    reservations = serializers.SerializerMethodField()

    class Meta:
        model = Room
        exclude = ["capacity"]

    def _checked_in(self, obj):
        return obj.reservations.filter(status="CHECKED_IN").select_related("guest").first()

    def get_current_guest(self, obj):
        res = self._checked_in(obj)
        if not res:
            return None
        return {
            "name": str(res.guest),
            "phone": res.guest.phone_number,
            "check_in": res.check_in_date,
            "check_out": res.check_out_date,
        }

    def get_reservations(self, obj):
        # Only expanded on the detail endpoint to keep the list light.
        if self.context.get("view") and getattr(self.context["view"], "action", None) != "retrieve":
            return []
        return [
            {
                "id": r.id,
                "guest": str(r.guest),
                "check_in": r.check_in_date,
                "check_out": r.check_out_date,
                "status": r.status,
            }
            for r in obj.reservations.select_related("guest").order_by("-check_in_date")[:10]
        ]
