import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import { guests, reservations } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";
import { fmtDate, fmtMoney } from "../../utils";

const GuestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    async () => {
      const [guest, all] = await Promise.all([guests.get(id), reservations.list()]);
      return { guest, stays: all.filter((r) => String(r.guest_id) === String(id)) };
    },
    [id],
  );

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Guest not found."} onRetry={reload} />;
  const { guest, stays } = data;

  const info = [
    ["Phone", guest.phone_number],
    ["Email", guest.email],
    ["Nationality", guest.nationality],
    ["ID", guest.id_type ? `${guest.id_type.replace(/_/g, " ")} ${guest.id_number || ""}` : null],
    ["Address", guest.address],
    ["Notes", guest.notes],
  ];

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate("/guests")}
        className="px-3 py-2 rounded-xl bg-gray-200 flex items-center gap-2 text-sm"
      >
        <FiArrowLeft size={14} /> Back to Guests
      </button>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-serif">{guest.first_name} {guest.last_name}</h1>
          <button
            onClick={() => navigate(`/guests/${guest.id}/edit`)}
            className="bg-[#C76A12] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <FiEdit /> Edit
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-6">
          {info.map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-500 text-sm">{label}</p>
              <p className="font-medium mt-0.5">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Stay history</h2>
        </div>
        <table className="w-full">
          <thead className="bg-[#F8F6F2]">
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Reservation</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {stays.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No stays yet.</td></tr>
            )}
            {stays.map((r) => (
              <tr
                key={r.id}
                onClick={() => navigate(`/reservations/${r.id}`)}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4">{r.reservation_number}</td>
                <td className="px-6 py-4">{r.room}</td>
                <td className="px-6 py-4">{fmtDate(r.checkIn)} – {fmtDate(r.checkOut)}</td>
                <td className="px-6 py-4">{fmtMoney(r.total_amount)}</td>
                <td className="px-6 py-4">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestDetailsPage;
