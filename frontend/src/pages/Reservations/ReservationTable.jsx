import ReservationRow from "./ReservationRow";
import useApi from "../../hooks/useApi";
import { reservations as reservationsApi } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";

const ReservationTable = ({ activeTab }) => {
  const { data, loading, error, reload } = useApi(() => reservationsApi.list(), []);
  const reservations = data || [];
  const filtered =
    activeTab === "ALL"
      ? reservations
      : reservations.filter((r) => r.status === activeTab);

  return (
    <div className="bg-white rounded-3xl overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead className="bg-[#F8F6F2]">
          <tr className="text-left text-xs uppercase tracking-widest text-gray-500">
            <th className="px-6 py-5">Guest</th>
            <th className="px-6 py-5">Room</th>
            <th className="px-6 py-5">Check-In</th>
            <th className="px-6 py-5">Check-Out</th>
            <th className="px-6 py-5">Paid</th>
            <th className="px-6 py-5">Balance</th>
            <th className="px-6 py-5">Staff</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && <tr><td colSpan={9}><Loading /></td></tr>}
          {error && <tr><td colSpan={9}><ErrorBox message={error} onRetry={reload} /></td></tr>}
          {!loading && !error && filtered.length === 0 && (
            <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">No reservations found.</td></tr>
          )}
          {filtered.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} onChanged={reload} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
