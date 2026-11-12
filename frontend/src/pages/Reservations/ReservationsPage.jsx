import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ReservationTable from "./ReservationTable";
import { useNavigate } from "react-router-dom";

const tabs = [
  "ALL",
  "CONFIRMED",
  "CHECKED-IN",
  "CHECKED-OUT",
  "CANCELLED",
  "PENDING",
];

const ReservationPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Reservations</h1>

        <button
          className="
            bg-[#C76A12]
            text-white
            px-4
            py-2.5
            rounded-xl
            flex
            items-center
            gap-2
          "
          onClick={() => navigate("/reservations/new")}
        >
          <FiPlus />
          New Reservation
        </button>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2.5 rounded-xl text-xs tracking-wide
              ${
                activeTab === tab
                  ? "bg-[#C76A12] text-white"
                  : "bg-[#ECE8E2] text-gray-600"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <ReservationTable activeTab={activeTab} />
      </div>
    </div>
  );
};

export default ReservationPage;
