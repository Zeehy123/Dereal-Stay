import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  dashboard: "Dashboard",
  reservations: "Reservations",
  rooms: "Rooms",
  guests: "Guests",
  payments: "Payments",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title = TITLES[pathname.split("/")[1]] || "Dashboard";
  const name = user?.full_name || user?.username || "";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const today = new Date().toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-20 bg-[#F5F5DC] border-b border-gray-300 flex justify-between items-center px-8 fixed left-64 right-0 top-0 z-20">
      <h1 className="text-3xl font-light">{title}</h1>

      <div className="flex items-center gap-4">
        <span className="hidden md:inline">{today}</span>

        <div
          title={name}
          className="w-10 h-10 bg-[#C76A12] rounded-full flex items-center justify-center text-white"
        >
          {initials || "?"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
