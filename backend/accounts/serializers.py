from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Role, User


STAFF_ROLES = ("Receptionist", "Accountant", "Manager")


class UserSerializer(serializers.ModelSerializer):
    role = serializers.StringRelatedField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "last_name", "full_name",
            "role", "is_staff", "is_superuser",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class StaffUserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=STAFF_ROLES)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = [
            "username", "first_name", "last_name", "email", "phone_number",
            "role", "password",
        ]

    def validate(self, attrs):
        user = User(
            username=attrs["username"],
            first_name=attrs.get("first_name", ""),
            last_name=attrs.get("last_name", ""),
            email=attrs.get("email", ""),
        )
        try:
            validate_password(attrs["password"], user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({"password": error.messages}) from error
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        role_name = validated_data.pop("role")
        role, _ = Role.objects.get_or_create(name=role_name)
        return User.objects.create_user(
            password=password,
            role=role,
            is_staff=False,
            is_superuser=False,
            **validated_data,
        )

    def to_representation(self, instance):
        return UserSerializer(instance).data


class LoginSerializer(TokenObtainPairSerializer):
    """Returns the JWT pair plus the user's profile so the UI needs only one call."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
