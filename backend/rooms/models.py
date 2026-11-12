from django.db import models


class Room(models.Model):

    class RoomStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        RESERVED = "RESERVED", "Reserved"
        OCCUPIED = "OCCUPIED", "Occupied"
        MAINTENANCE = "MAINTENANCE", "Maintenance"

    class RoomType(models.TextChoices):
        STANDARD = "STANDARD", "Standard"
        SINGLE = "SINGLE", "Single"
        DOUBLE = "DOUBLE", "Double"
        DELUXE = "DELUXE", "Deluxe"
        EXECUTIVE = "EXECUTIVE", "Executive"
        SUITE = "SUITE", "Suite"

    room_number = models.CharField(
        max_length=20,
        unique=True
    )

    room_name = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    amenities = models.JSONField(
        default=list,
        blank=True
    )

    room_type = models.CharField(
        max_length=20,
        choices=RoomType.choices
    )

    price_per_night = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=RoomStatus.choices,
        default=RoomStatus.AVAILABLE
    )

    floor = models.PositiveIntegerField()

    capacity = models.PositiveIntegerField()

    description = models.TextField(
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
        return f"Room {self.room_number}"

    def sync_status(self):
        """Derive OCCUPIED/AVAILABLE from reservations. MAINTENANCE is manual and is left alone."""
        if self.status == self.RoomStatus.MAINTENANCE:
            return
        occupied = self.reservations.filter(status="CHECKED_IN").exists()
        new_status = self.RoomStatus.OCCUPIED if occupied else self.RoomStatus.AVAILABLE
        if new_status != self.status:
            self.status = new_status
            self.save(update_fields=["status", "updated_at"])
