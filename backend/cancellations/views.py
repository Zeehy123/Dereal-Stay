from rest_framework import viewsets

from .models import Cancellation
from .serializers import CancellationSerializer


class CancellationViewSet(viewsets.ModelViewSet):
    queryset = Cancellation.objects.select_related("reservation")
    serializer_class = CancellationSerializer

    def perform_create(self, serializer):
        serializer.save(cancelled_by=self.request.user)
