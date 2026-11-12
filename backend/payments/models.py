from django.conf import settings
from django.db import models

from reservations.models import Reservation


class Payment(models.Model):

    class PaymentMethod(models.TextChoices):
        CASH = "CASH", "Cash"
        TRANSFER = "TRANSFER", "Bank Transfer"
        POS = "POS", "POS"

    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)

    payment_date = models.DateField()

    receipt = models.FileField(upload_to="receipts/", blank=True, null=True)

    notes = models.TextField(blank=True, null=True)

    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-payment_date", "-id"]

    @property
    def receipt_no(self):
        return f"RCP-{self.payment_date.year}-{self.pk:04d}"

    def __str__(self):
        return f"{self.reservation.reservation_number} - ₦{self.amount}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.reservation.recalculate_payments()

    def delete(self, *args, **kwargs):
        reservation = self.reservation
        super().delete(*args, **kwargs)
        reservation.recalculate_payments()
