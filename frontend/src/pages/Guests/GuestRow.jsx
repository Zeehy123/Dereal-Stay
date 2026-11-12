import { FiEye, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const GuestRow = ({ guest }) => {
  const navigate = useNavigate();

  const initials = guest.first_name[0] + guest.last_name[0];

  return (
    <tr className="border-b border-gray-400 hover:bg-gray-50">
      {/* Guest */}

      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div
            className="
              w-10 h-10
              rounded-full
              bg-[#C76A12]
              text-white
              flex
              items-center
              justify-center
              text-sm
              font-medium
            "
          >
            {initials}
          </div>

          <div>
            <p className="font-medium">
              {guest.first_name} {guest.last_name}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">{guest.phone}</td>

      <td className="px-5 py-5">{guest.email || "—"}</td>

      <td className="px-5 py-5">{guest.reservations}</td>

      <td className="px-5 py-5 text-[#C76A12] font-medium">
        ₦{guest.total_spent.toLocaleString()}
      </td>

      <td className="px-5 py-5">{guest.last_visit}</td>

      <td className="px-5 py-5">
        <span
          className={`
            px-3 py-1
            rounded-full
            text-xs
            ${
              guest.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }
          `}
        >
          {guest.status}
        </span>
      </td>

      <td className="px-5 py-5">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/guests/${guest.id}`)}
            className="
              p-2
              rounded-lg
              bg-blue-50
              text-blue-600
            "
          >
            <FiEye />
          </button>

          <button
            onClick={() => navigate(`/guests/${guest.id}/edit`)}
            className="
              p-2
              rounded-lg
              bg-orange-50
              text-[#C76A12]
            "
          >
            <FiEdit />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default GuestRow;
