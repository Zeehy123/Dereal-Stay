from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, StaffUserCreateSerializer, UserSerializer


class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class MeView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class StaffUserCreateView(CreateAPIView):
    serializer_class = StaffUserCreateSerializer
    permission_classes = [IsSuperuser]
