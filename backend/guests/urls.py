from rest_framework.routers import DefaultRouter
from .views import GuestViewSet

router = DefaultRouter()
router.register("guests", GuestViewSet)

urlpatterns = router.urls