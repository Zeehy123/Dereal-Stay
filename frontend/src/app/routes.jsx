import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ReservationPage from "../pages/Reservations/ReservationsPage";
import NewReservationPage from "../pages/Reservations/NewReservationPage";
import ReservationDetails from "../pages/Reservations/ReservationDetails";
import EditReservationPage from "../pages/Reservations/EditReservationModal";
import RoomPage from "../pages/Rooms/RoomPage";
import RoomDetailsPage from "../pages/Rooms/RoomDetailsPage";
import NewRoomPage from "../pages/Rooms/NewRoomPage";
import EditRoomPage from "../pages/Rooms/EditRoomPage";
import GuestPage from "../pages/Guests/GuestPage";
import NewGuestPage from "../pages/Guests/NewGuestPage";
import EditGuestPage from "../pages/Guests/EditGuestPage";
import GuestDetailsPage from "../pages/Guests/GuestDetailsPage";
import Payments from "../pages/Payments/Payments";

export const router = createBrowserRouter([
  // Public
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },

  // Private: everything below needs a valid login
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "reservations", element: <ReservationPage /> },
          { path: "reservations/new", element: <NewReservationPage /> },
          { path: "reservations/:id/edit", element: <EditReservationPage /> },
          { path: "reservations/:id", element: <ReservationDetails /> },
          { path: "rooms", element: <RoomPage /> },
          { path: "rooms/new", element: <NewRoomPage /> },
          { path: "rooms/:id/edit", element: <EditRoomPage /> },
          { path: "rooms/:id", element: <RoomDetailsPage /> },
          { path: "guests", element: <GuestPage /> },
          { path: "guests/new", element: <NewGuestPage /> },
          { path: "guests/:id/edit", element: <EditGuestPage /> },
          { path: "guests/:id", element: <GuestDetailsPage /> },
          { path: "payments", element: <Payments /> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);
