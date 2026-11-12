import {
  FiEdit,
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiWifi,
  FiTv,
  FiWind,
  FiCoffee,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { rooms } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";
import { fmtDate } from "../../utils";
const RoomDetailsPage = () => {
  const { id } = useParams();
  const { data: room, loading, error, reload } = useApi(() => rooms.get(id), [id]);
  const getStatusStyle = () => {
    switch (room.status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";

      case "OCCUPIED":
        return "bg-red-100 text-red-700";

      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const navigate = useNavigate();
  if (loading) return <Loading />;
  if (error || !room) return <ErrorBox message={error || "Room not found."} onRetry={reload} />;
  return (
    <div className="p-6">
      {/* Header */}

      <button
        onClick={() => navigate("/rooms")}
        className="px-3 py-2 rounded-xl bg-gray-200 flex items-center gap-2 mb-2"
      >
        <FiArrowLeft />
        Back
      </button>
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif">Room {room.room_number}</h1>

              <span
                className={`
                  px-3 py-1
                  rounded-full
                  text-sm
                  ${getStatusStyle()}
                `}
              >
                {room.status}
              </span>
            </div>

            <p className="text-gray-500 mt-2">{room.room_name}</p>
          </div>

          <button
            onClick={() => navigate(`/rooms/${room.id}/edit`)}
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
            <FiEdit />
            Edit Room
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side */}

        <div className="lg:col-span-2 space-y-6">
          {/* Room Information */}

          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <FiHome />

              <h2 className="font-semibold text-lg">Room Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500">Room Number</p>

                <p>{room.room_number}</p>
              </div>

              <div>
                <p className="text-gray-500">Room Name</p>

                <p>{room.room_name}</p>
              </div>

              <div>
                <p className="text-gray-500">Room Type</p>

                <p>{room.room_type}</p>
              </div>

              <div>
                <p className="text-gray-500">Floor</p>

                <p>{room.floor}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}

          <div className="bg-white rounded-3xl p-6">
            <h2 className="font-semibold text-lg mb-5">Amenities</h2>

            <div className="flex flex-wrap gap-3">
              {room.amenities.includes("wifi") && (
                <span className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiWifi />
                  WiFi
                </span>
              )}

              {room.amenities.includes("tv") && (
                <span className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiTv />
                  TV
                </span>
              )}

              {room.amenities.includes("ac") && (
                <span className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiWind />
                  AC
                </span>
              )}

              {room.amenities.includes("minibar") && (
                <span className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiCoffee />
                  Mini Bar
                </span>
              )}
            </div>
          </div>

          {/* Reservation History */}

          <div className="bg-white rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Reservation History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F2]">
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">Guest</th>

                    <th className="px-5 py-4">Check-In</th>

                    <th className="px-5 py-4">Check-Out</th>

                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {room.reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-b border-gray-200"
                    >
                      <td className="px-5 py-4">{reservation.guest}</td>

                      <td className="px-5 py-4">{fmtDate(reservation.check_in)}</td>

                      <td className="px-5 py-4">{fmtDate(reservation.check_out)}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                              px-3 py-1
                              rounded-full
                              text-xs
                              ${
                                reservation.status === "CHECKED-IN"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            `}
                        >
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="space-y-6">
          {/* Pricing */}

          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign />

              <h2 className="font-semibold">Pricing</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Rate/Night</span>

                <span>₦{room.price_per_night.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Max Guests</span>

                <span>{room.max_guests}</span>
              </div>
            </div>
          </div>

          {/* Current Occupant */}

          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiUsers />

              <h2 className="font-semibold">Current Occupant</h2>
            </div>

            {room.current_guest ? (
              <div className="space-y-3">
                <p className="font-medium">{room.current_guest.name}</p>

                <p className="text-sm text-gray-500">
                  {room.current_guest.phone}
                </p>

                <div className="pt-3 border-t">
                  <p className="text-sm">
                    Check-In: {fmtDate(room.current_guest.check_in)}
                  </p>

                  <p className="text-sm">
                    Check-Out: {fmtDate(room.current_guest.check_out)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Room currently vacant.</p>
            )}
          </div>

          {/* Quick Stats */}

          <div className="bg-white rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar />

              <h2 className="font-semibold">Statistics</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Bookings</span>
                <span>{room.reservations.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span>{room.status}</span>
              </div>

              <div className="flex justify-between">
                <span>Floor</span>
                <span>{room.floor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
