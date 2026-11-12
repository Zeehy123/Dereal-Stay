from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from django.db.models.deletion import ProtectedError

from .models import Room
from .serializers import RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by("room_number")
    serializer_class = RoomSerializer

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError("This room has reservations and cannot be deleted. Set it to maintenance instead.")
