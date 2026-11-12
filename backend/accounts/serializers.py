from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    role = serializers.StringRelatedField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "full_name", "role", "is_staff"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class LoginSerializer(TokenObtainPairSerializer):
    """Returns the JWT pair plus the user's profile so the UI needs only one call."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
