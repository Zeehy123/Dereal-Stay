from django.db.models.deletion import ProtectedError
from rest_framework import viewsets

from .models import Guest
from .serializers import GuestSerializer


class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all().order_by("-created_at")
    serializer_class = GuestSerializer
