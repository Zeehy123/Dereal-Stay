import { fmtDate, fmtMoney } from "../../utils";

const getStatusStyle = (status) => {
  switch (status) {
    case "CHECKED-IN":
      return "bg-green-100 text-green-700";
    case "CONFIRMED":
      return "bg-orange-100 text-orange-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const RecentBookings = ({ bookings = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8F6F2]">
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Guest</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Check-In</th>
              <th className="px-6 py-4">Check-Out</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No bookings yet.</td></tr>
            )}
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C76A12] text-white flex items-center justify-center text-sm font-semibold">
                      {booking.initials}
                    </div>

                    <div>
                      <p className="font-medium">{booking.guest}</p>

                      <p className="text-sm text-gray-500">
                        {booking.guestsCount} guests
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">{booking.room}</td>

                <td className="px-6 py-4">{fmtDate(booking.check_in)}</td>

                <td className="px-6 py-4">{fmtDate(booking.check_out)}</td>

                <td className="px-6 py-4 font-medium text-[#C76A12]">
                  {fmtMoney(booking.amount)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
