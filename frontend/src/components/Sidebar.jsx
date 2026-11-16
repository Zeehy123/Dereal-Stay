import {
  MdDashboard,
  MdMeetingRoom,
  MdPeople,
  MdPayments,
  MdManageAccounts,
} from "react-icons/md";

import { FaCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { BRAND_NAME } from "../config";
import { useAuth } from "../context/AuthContext";
const NAV_LINKS = [
  { to: "/dashboard", icon: MdDashboard, label: "Dashboard" },
  { to: "/reservations", icon: FaCalendarAlt, label: "Reservations" },
  { to: "/rooms", icon: MdMeetingRoom, label: "Rooms" },
  { to: "/guests", icon: MdPeople, label: "Guests" },
  { to: "/payments", icon: MdPayments, label: "Payments" },
];
const Sidebar = () => {
  const { user } = useAuth();
  const navLinks = user?.is_superuser
    ? [...NAV_LINKS, { to: "/staff-users", icon: MdManageAccounts, label: "Staff Users" }]
    : NAV_LINKS;

  return (
    <div className="w-64 h-screen bg-[#1b1816] text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 text-2xl font-semibold">{BRAND_NAME}</div>

      <nav className="flex-1 px-4">
        {navLinks.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
            flex items-center gap-3 p-3 rounded-lg
            ${isActive ? "bg-[#C76A12]" : "hover:bg-[#2c2825]"}
          `}
          >
            <Icon size={18} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
