from rest_framework.routers import DefaultRouter
from .views import RoomViewSet

router = DefaultRouter()
router.register("rooms", RoomViewSet)

urlpatterns = router.urls