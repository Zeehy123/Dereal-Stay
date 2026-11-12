import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import GuestTable from "./GuestTable";

const tabs = ["ALL", "ACTIVE", "INACTIVE"];

const GuestPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ALL");

  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif">Guests</h1>

        <button
          onClick={() => navigate("/guests/new")}
          className="
            bg-[#C76A12]
            text-white
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
          "
        >
          <FiPlus />
          New Guest
        </button>
      </div>

      {/* Search */}

      <div className="relative mb-6 max-w-md">
        <FiSearch
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-12
            pr-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-white
            focus:outline-none
          "
        />
      </div>

      {/* Tabs */}

      <div className="flex gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-5 py-3 rounded-xl
              text-sm tracking-wider
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

      <GuestTable activeTab={activeTab} search={search} />
    </div>
  );
};

export default GuestPage;
