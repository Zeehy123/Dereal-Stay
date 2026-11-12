from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from cancellations.models import Cancellation
from payments.models import Payment
from rooms.models import Room

from .models import Reservation
from .serializers import ReservationSerializer

S = Reservation.ReservationStatus


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.select_related("guest", "room", "staff_on_duty")
    serializer_class = ReservationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params
        if params.get("status"):
            qs = qs.filter(status=params["status"])
        if params.get("guest"):
            qs = qs.filter(guest_id=params["guest"])
        if params.get("room"):
            qs = qs.filter(room_id=params["room"])
        return qs

    @transaction.atomic
    def perform_create(self, serializer):
        deposit = serializer.validated_data.pop("initial_payment", Decimal("0"))
        reservation = serializer.save(staff_on_duty=self.request.user)
        if deposit and deposit > 0:
            if deposit > reservation.total_amount:
                raise ValidationError({"initial_payment": "Deposit exceeds the reservation total."})
            Payment.objects.create(
                reservation=reservation,
                amount=deposit,
                payment_method=Payment.PaymentMethod.CASH,
                payment_date=timezone.localdate(),
                notes="Deposit at booking",
                recorded_by=self.request.user,
            )
            reservation.refresh_from_db()
            if reservation.status == S.PENDING:
                reservation.status = S.CONFIRMED
                reservation.save()

    def perform_update(self, serializer):
        serializer.validated_data.pop("initial_payment", None)
        serializer.save()

    # ---- status transitions -------------------------------------------------
    @action(detail=True, methods=["post"], url_path="check-in")
    @transaction.atomic
    def check_in(self, request, pk=None):
        res = self.get_object()
        if res.status not in (S.PENDING, S.CONFIRMED):
            raise ValidationError(f"Cannot check in a {res.get_status_display().lower()} reservation.")
        res.status = S.CHECKED_IN
        res.save()
        res.room.sync_status()
        return Response(self.get_serializer(res).data)

    @action(detail=True, methods=["post"], url_path="check-out")
    @transaction.atomic
    def check_out(self, request, pk=None):
        res = self.get_object()
        if res.status != S.CHECKED_IN:
            raise ValidationError("Only checked-in reservations can be checked out.")
        res.status = S.CHECKED_OUT
        res.save()
        res.room.sync_status()
        return Response(self.get_serializer(res).data)

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def cancel(self, request, pk=None):
        res = self.get_object()
        if res.status in (S.CANCELLED, S.CHECKED_OUT):
            raise ValidationError(f"A {res.get_status_display().lower()} reservation cannot be cancelled.")
        Cancellation.objects.create(
            reservation=res,
            reason=request.data.get("reason") or "No reason given",
            refund_amount=request.data.get("refund_amount") or 0,
            cancelled_by=request.user,
        )
        res.refresh_from_db()
        return Response(self.get_serializer(res).data)


@api_view(["GET"])
def dashboard(request):
    """Single call that feeds the dashboard cards and tables."""
    today = timezone.localdate()
    room_counts = {r["status"]: r["n"] for r in Room.objects.values("status").annotate(n=Count("id"))}
    revenue = Payment.objects.aggregate(t=Sum("amount"))["t"] or 0
    month_revenue = (
        Payment.objects.filter(payment_date__year=today.year, payment_date__month=today.month)
        .aggregate(t=Sum("amount"))["t"] or 0
    )
    recent = Reservation.objects.select_related("guest", "room").order_by("-created_at")[:6]
    checkouts = (
        Reservation.objects.select_related("guest", "room")
        .filter(status=S.CHECKED_IN, check_out_date__lte=today + timedelta(days=2))
        .order_by("check_out_date")[:6]
    )

    def row(r):
        return {
            "id": r.id, "guest": str(r.guest), "room": r.room.room_number,
            "guests_count": r.number_of_guests, "check_in": r.check_in_date,
            "check_out": r.check_out_date, "amount": r.total_amount, "status": r.status,
        }

    return Response({
        "rooms": {
            "available": room_counts.get("AVAILABLE", 0),
            "occupied": room_counts.get("OCCUPIED", 0),
            "maintenance": room_counts.get("MAINTENANCE", 0),
            "total": sum(room_counts.values()),
        },
        "revenue": {"total": revenue, "this_month": month_revenue},
        "recent_bookings": [row(r) for r in recent],
        "upcoming_checkouts": [row(r) for r in checkouts],
    })
