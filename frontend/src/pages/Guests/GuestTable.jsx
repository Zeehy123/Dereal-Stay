import GuestRow from "./GuestRow";
import useApi from "../../hooks/useApi";
import { guests as guestsApi } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";

const GuestTable = ({ activeTab, search }) => {
  const { data, loading, error, reload } = useApi(() => guestsApi.list(), []);
  let filtered = data || [];

  if (activeTab !== "ALL") {
    filtered = filtered.filter((guest) => guest.status === activeTab);
  }

  if (search) {
    filtered = filtered.filter((guest) =>
      `${guest.first_name} ${guest.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-3xl
        overflow-x-auto
      "
    >
      <table className="min-w-full">
        <thead className="bg-[#F8F6F2]">
          <tr
            className="
              text-left
              text-xs
              uppercase
              tracking-widest
              text-gray-500
            "
          >
            <th className="px-5 py-4">Guest</th>

            <th className="px-5 py-4">Phone</th>

            <th className="px-5 py-4">Email</th>

            <th className="px-5 py-4">Reservations</th>

            <th className="px-5 py-4">Total Spent</th>

            <th className="px-5 py-4">Last Visit</th>

            <th className="px-5 py-4">Status</th>

            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr><td colSpan={8}><Loading /></td></tr>
          )}
          {error && (
            <tr><td colSpan={8}><ErrorBox message={error} onRetry={reload} /></td></tr>
          )}
          {!loading && !error && filtered.length === 0 && (
            <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">No guests found.</td></tr>
          )}
          {filtered.map((guest) => (
            <GuestRow key={guest.id} guest={guest} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTable;
