import { useState } from "react";
import RoomCard from "./RoomCard";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { rooms as roomsApi } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";
const filters = ["ALL", "AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const RoomPage = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { data, loading, error, reload } = useApi(() => roomsApi.list(), []);
  const rooms = data || [];

  const filteredRooms =
    activeFilter === "ALL"
      ? rooms
      : rooms.filter((room) => room.status === activeFilter);
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif">Rooms & Rates</h1>

        {/* <p className="text-gray-500">
          {availableRooms} of {rooms.length} rooms available
        </p> */}
        <button
          onClick={() => navigate("/rooms/new")}
          className="
                      bg-[#C76A12]
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      flex
                      items-center
                      gap-2
                    "
        >
          {/* <FiAdd /> */}
          New Room
        </button>
      </div>

      {/* Filters */}

      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              px-4 py-2
              rounded-xl
              text-sm
              transition
              ${
                activeFilter === filter
                  ? "bg-[#C76A12] text-white"
                  : "bg-[#ECE8E2] text-gray-600"
              }
            `}
          >
            {filter === "ALL" ? "ALL ROOMS" : filter}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {!loading && !error && filteredRooms.length === 0 && (
        <p className="text-gray-500">No rooms to show yet.</p>
      )}

      {/* Cards */}

      <div
        className="
          grid
          xl:grid-cols-4
          lg:grid-cols-3
          md:grid-cols-2
          gap-6
        "
      >
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
