from rest_framework import viewsets

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("reservation__guest", "reservation__room", "recorded_by")
    serializer_class = PaymentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("reservation"):
            qs = qs.filter(reservation_id=self.request.query_params["reservation"])
        return qs

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)
