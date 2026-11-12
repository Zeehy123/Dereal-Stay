import { FiWifi, FiTv, FiWind, FiCoffee, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-700 border-green-600",

    OCCUPIED: "bg-red-100 text-red-700 border-red-600",

    MAINTENANCE: "bg-yellow-100 text-yellow-700 border-yellow-600",
  };

  return (
    <div
      className={`
        bg-white
        rounded-3xl
        p-5
        border-t-4
        shadow-sm
        hover:shadow-md
        transition
        ${statusStyles[room.status]?.split(" ")[2]}
      `}
    >
      {/* Header */}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-serif">{room.room_number}</h3>

          <span
            className="
            bg-orange-100
            text-orange-600
            px-2 py-1
            rounded-full
            text-xs
          "
          >
            Floor {room.floor}
          </span>
        </div>

        <span
          className={`
          px-3 py-1
          rounded-full
          text-xs
          font-medium
          ${statusStyles[room.status]?.replace(
            statusStyles[room.status]?.split(" ")[2],
            "",
          )}
        `}
        >
          {room.status}
        </span>
      </div>

      {/* Room Name */}
      <div className=" flex ">
        <h2 className="font-semibold text-lg mb-6">{room.room_name}</h2>
      </div>
      {/* Details */}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">TYPE</span>

          <span>{room.room_type}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">PRICE/NIGHT</span>

          <span className="text-[#C76A12] font-medium">
            ₦{room.price_per_night.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">MAX GUESTS</span>

          <span>{room.max_guests}</span>
        </div>
      </div>

      {/* Amenities */}

      <div className="flex flex-wrap gap-2 mt-5">
        {room.amenities.includes("wifi") && (
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
            <FiWifi size={12} />
            WiFi
          </span>
        )}

        {room.amenities.includes("tv") && (
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
            <FiTv size={12} />
            TV
          </span>
        )}

        {room.amenities.includes("ac") && (
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
            <FiWind size={12} />
            AC
          </span>
        )}

        {room.amenities.includes("minibar") && (
          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
            <FiCoffee size={12} />
            Mini Bar
          </span>
        )}
      </div>

      {/* Occupant */}

      {room.current_guest && (
        <div className="mt-5 p-3 bg-[#F8F6F2] rounded-xl">
          <div className="flex items-center gap-2">
            <div
              className="
                w-8 h-8
                rounded-full
                bg-[#C76A12]
                text-white
                flex
                items-center
                justify-center
                text-xs
              "
            >
              {room.current_guest.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <span className="text-sm">{room.current_guest.name}</span>
          </div>
        </div>
      )}

      {/* Footer */}

      <div className="border-t mt-5 pt-4">
        <div className="flex gap-2">
          <button
            className={`
            px-3 py-2 rounded-xl text-xs
            ${
              room.status === "AVAILABLE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
          >
            {room.status}
          </button>

          <button
            className="
            px-3 py-2
            rounded-xl
            bg-gray-100
            text-gray-600
            text-xs
            flex items-center gap-2
          "
            onClick={() => navigate(`/rooms/${room.id}`, { state: room })}
          >
            <FiEye />
            VIEW
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
