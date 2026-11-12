import uuid
from datetime import date

from django.conf import settings
from django.db import models
from django.db.models import Sum

from guests.models import Guest
from rooms.models import Room


def generate_reservation_number():
    """Human-friendly reference, e.g. GH-2026-A3F9C1."""
    return f"GH-{date.today().year}-{uuid.uuid4().hex[:6].upper()}"


class Reservation(models.Model):

    class ReservationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CHECKED_IN = "CHECKED_IN", "Checked In"
        CHECKED_OUT = "CHECKED_OUT", "Checked Out"
        CANCELLED = "CANCELLED", "Cancelled"

    # Statuses that hold a room (used for double-booking checks).
    ACTIVE_STATUSES = ("PENDING", "CONFIRMED", "CHECKED_IN")

    reservation_number = models.CharField(
        max_length=40,
        default=generate_reservation_number,
        unique=True,
        editable=False,
    )

    guest = models.ForeignKey(
        Guest,
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name="reservations"
    )

    reservation_date = models.DateTimeField(auto_now_add=True)

    check_in_date = models.DateField()
    check_out_date = models.DateField()

    number_of_guests = models.PositiveIntegerField(default=1)
    special_requests = models.TextField(blank=True, default="")

    duration_of_stay = models.PositiveIntegerField(default=0)

    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    date_of_payment = models.DateField(null=True, blank=True)

    staff_on_duty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=ReservationStatus.choices,
        default=ReservationStatus.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.reservation_number)

    def save(self, *args, **kwargs):
        # Totals are always derived, never trusted from the client.
        self.duration_of_stay = (self.check_out_date - self.check_in_date).days
        self.total_amount = self.room.price_per_night * self.duration_of_stay
        self.balance = self.total_amount - self.amount_paid
        super().save(*args, **kwargs)

    def recalculate_payments(self):
        """Sync amount_paid / balance from the Payment records."""
        total_paid = self.payments.aggregate(total=Sum("amount"))["total"] or 0
        self.amount_paid = total_paid
        self.balance = self.total_amount - total_paid
        last = self.payments.order_by("-payment_date", "-id").first()
        self.date_of_payment = last.payment_date if last else None
        super().save(update_fields=["amount_paid", "balance", "date_of_payment", "updated_at"])
