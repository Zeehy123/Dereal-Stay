from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase

from rooms.models import Room

User = get_user_model()


class GuesthouseFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("front", password="pass12345", first_name="Fran")
        self.room = Room.objects.create(
            room_number="101", room_name="Garden View", room_type="STANDARD",
            price_per_night=15000, floor=1, capacity=2, amenities=["wifi"],
        )
        today = timezone.localdate()
        self.in_ = today + timedelta(days=1)
        self.out = today + timedelta(days=4)

    def login(self):
        r = self.client.post("/api/auth/login/", {"username": "front", "password": "pass12345"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["user"]["username"], "front")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {r.data['access']}")

    def make_guest(self):
        r = self.client.post("/api/guests/", {
            "first_name": "Arthur", "last_name": "Morgan", "phone_number": "0801",
            "id_type": "NATIONAL_ID", "nationality": "Nigerian",
        })
        self.assertEqual(r.status_code, 201, r.data)
        return r.data["id"]

    def test_requires_auth(self):
        self.assertEqual(self.client.get("/api/rooms/").status_code, 401)
        r = self.client.post("/api/auth/login/", {"username": "front", "password": "wrong"})
        self.assertEqual(r.status_code, 401)

    def test_full_booking_lifecycle(self):
        self.login()
        guest = self.make_guest()
        payload = {
            "guest": guest, "room": self.room.id, "check_in_date": self.in_,
            "check_out_date": self.out, "number_of_guests": 2, "initial_payment": 20000,
            "special_requests": "Late check-in",
        }
        r = self.client.post("/api/reservations/", payload)
        self.assertEqual(r.status_code, 201, r.data)
        rid = r.data["id"]
        self.assertTrue(r.data["reservation_number"].startswith("GH-"))
        self.assertEqual(float(r.data["total_amount"]), 45000)
        self.assertEqual(float(r.data["amount_paid"]), 20000)
        self.assertEqual(float(r.data["balance"]), 25000)
        self.assertEqual(r.data["status"], "CONFIRMED")

        # overlapping booking and too many guests are rejected
        self.assertEqual(self.client.post("/api/reservations/", payload).status_code, 400)
        self.assertEqual(self.client.post("/api/reservations/", {**payload, "number_of_guests": 5}).status_code, 400)

        # overpayment rejected, valid payment accepted
        over = self.client.post("/api/payments/", {"reservation": rid, "amount": 99999, "payment_method": "CASH"})
        self.assertEqual(over.status_code, 400)
        ok = self.client.post("/api/payments/", {"reservation": rid, "amount": 25000, "payment_method": "TRANSFER"})
        self.assertEqual(ok.status_code, 201, ok.data)
        self.assertEqual(ok.data["payment_type"], "Balance")
        res = self.client.get(f"/api/reservations/{rid}/").data
        self.assertEqual(float(res["balance"]), 0)

        # check-in -> room occupied -> check-out -> room available
        self.assertEqual(self.client.post(f"/api/reservations/{rid}/check-in/").status_code, 200)
        room = self.client.get(f"/api/rooms/{self.room.id}/").data
        self.assertEqual(room["status"], "OCCUPIED")
        self.assertEqual(room["current_guest"]["name"], "Arthur Morgan")
        self.assertEqual(self.client.post(f"/api/reservations/{rid}/check-out/").status_code, 200)
        self.assertEqual(self.client.get(f"/api/rooms/{self.room.id}/").data["status"], "AVAILABLE")

        d = self.client.get("/api/dashboard/").data
        self.assertEqual(d["rooms"]["total"], 1)
        self.assertEqual(float(d["revenue"]["total"]), 45000)

    def test_cancel_releases_room(self):
        self.login()
        guest = self.make_guest()
        r = self.client.post("/api/reservations/", {
            "guest": guest, "room": self.room.id, "check_in_date": self.in_, "check_out_date": self.out,
        })
        rid = r.data["id"]
        c = self.client.post(f"/api/reservations/{rid}/cancel/", {"reason": "Change of plans"})
        self.assertEqual(c.status_code, 200, c.data)
        self.assertEqual(c.data["status"], "CANCELLED")
        # the dates are free again
        again = self.client.post("/api/reservations/", {
            "guest": guest, "room": self.room.id, "check_in_date": self.in_, "check_out_date": self.out,
        })
        self.assertEqual(again.status_code, 201, again.data)
