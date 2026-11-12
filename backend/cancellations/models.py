from django.conf import settings
from django.db import models, transaction

from reservations.models import Reservation


class Cancellation(models.Model):

    class RefundStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        REFUNDED = "REFUNDED", "Refunded"
        NO_REFUND = "NO_REFUND", "No Refund"

    reservation = models.OneToOneField(
        Reservation,
        on_delete=models.CASCADE,
        related_name="cancellation"
    )

    reason = models.TextField()

    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    refund_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    refund_status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.PENDING
    )

    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    cancelled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cancellation - {self.reservation.reservation_number}"

    def save(self, *args, **kwargs):
        with transaction.atomic():
            reservation = self.reservation

            # Snapshot what the guest had paid at the time of cancelling.
            if not self.amount_paid:
                self.amount_paid = reservation.amount_paid

            super().save(*args, **kwargs)

            reservation.status = Reservation.ReservationStatus.CANCELLED
            reservation.save()

            # Release the room if nobody else is checked in.
            reservation.room.sync_status()
