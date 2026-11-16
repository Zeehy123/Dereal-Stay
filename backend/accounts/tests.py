from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Role


User = get_user_model()


class StaffUserCreateTests(APITestCase):
    def setUp(self):
        self.url = reverse("staff-user-create")
        self.admin = User.objects.create_superuser(
            username="owner",
            email="owner@example.com",
            password="Owner-Strong-Password-42!",
        )

    def test_superuser_can_create_role_account_with_hashed_password(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(self.url, {
            "username": "frontdesk",
            "first_name": "Front",
            "last_name": "Desk",
            "email": "frontdesk@example.com",
            "phone_number": "08012345678",
            "role": "Receptionist",
            "password": "Reception-Strong-Password-42!",
        })

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username="frontdesk")
        self.assertTrue(user.check_password("Reception-Strong-Password-42!"))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.role, Role.objects.get(name="Receptionist"))
        self.assertEqual(response.data["role"], "Receptionist")
        self.assertNotIn("password", response.data)

    def test_regular_staff_cannot_create_accounts(self):
        staff_user = User.objects.create_user(
            username="receptionist",
            password="Reception-Strong-Password-42!",
        )
        self.client.force_authenticate(staff_user)

        response = self.client.post(self.url, {
            "username": "newuser",
            "role": "Accountant",
            "password": "Accountant-Strong-Password-42!",
        })

        self.assertEqual(response.status_code, 403)
        self.assertFalse(User.objects.filter(username="newuser").exists())
