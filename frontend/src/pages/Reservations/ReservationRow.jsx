import { FiEye, FiEdit, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { reservations } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { fmtDate } from "../../utils";

const ReservationRow = ({ reservation, onChanged }) => {
  const navigate = useNavigate();
  const getStatusStyle = (status) => {
    switch (status) {
      case "CHECKED-IN":
        return "bg-green-100 text-green-700";

      case "CONFIRMED":
        return "bg-orange-100 text-orange-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className="
              w-8
              h-8
              rounded-full
              bg-[#C76A12]
              text-white
              flex
              items-center
              justify-center
              font-semibold
            "
          >
            {reservation.initials}
          </div>

          <span>{reservation.guest}</span>
        </div>
      </td>

      <td className="px-4 py-3">{reservation.room}</td>

      <td className="px-4 py-3">{fmtDate(reservation.checkIn)}</td>

      <td className="px-4 py-3">{fmtDate(reservation.checkOut)}</td>

      <td className="px-4 py-3 text-green-600 font-medium">
        {reservation.paid}
      </td>

      <td className="px-4 py-3 text-red-500 font-medium">
        {reservation.balanceLabel}
      </td>

      <td className="px-4 py-3">{reservation.staff}</td>

      <td className="px-6 py-5">
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${getStatusStyle(reservation.status)}
          `}
        >
          {reservation.status}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            className="p-2 bg-gray-100 rounded-full"
            onClick={() => navigate(`/reservations/${reservation.id}`)}
          >
            <FiEye />
          </button>

          <button
            className="p-2 bg-orange-100 text-orange-700 rounded-full"
            onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
          >
            <FiEdit />
          </button>

          <button
            className="p-2 bg-red-100 text-red-700 rounded-full disabled:opacity-40"
            disabled={["CANCELLED", "CHECKED-OUT"].includes(reservation.status)}
            title="Cancel reservation"
            onClick={async () => {
              if (!window.confirm("Cancel this reservation? This cannot be undone.")) return;
              try {
                await reservations.cancel(reservation.id, "Cancelled from reservations list");
                onChanged?.();
              } catch (e) {
                window.alert(errorMessage(e));
              }
            }}
          >
            <FiXCircle />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReservationRow;
