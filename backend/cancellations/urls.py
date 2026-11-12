from rest_framework.routers import (
    DefaultRouter
)

from .views import CancellationViewSet

router = DefaultRouter()

router.register(
    "cancellations",
    CancellationViewSet
)

urlpatterns = router.urls