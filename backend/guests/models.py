from django.db import models


class Guest(models.Model):

    class IdType(models.TextChoices):
        NATIONAL_ID = "NATIONAL_ID", "National ID"
        PASSPORT = "PASSPORT", "Passport"
        DRIVERS_LICENSE = "DRIVERS_LICENSE", "Driver's License"
        VOTERS_CARD = "VOTERS_CARD", "Voter's Card"

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    phone_number = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    nationality = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    id_type = models.CharField(
        max_length=30,
        choices=IdType.choices,
        blank=True,
        null=True
    )

    id_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    emergency_contact_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    emergency_contact_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"