from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ReservationViewSet, dashboard

router = DefaultRouter()
router.register("reservations", ReservationViewSet)

urlpatterns = router.urls + [
    path("dashboard/", dashboard, name="dashboard"),
]
