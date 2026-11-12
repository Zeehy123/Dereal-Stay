import { useState } from "react";
import { FiSearch, FiEye } from "react-icons/fi";
import { MdPayments } from "react-icons/md";
import PaymentReceiptModal from "./PaymentReceiptModal";
import useApi from "../../hooks/useApi";
import { payments as paymentsApi } from "../../services/guesthouse";
import { ErrorBox, Loading } from "../../components/Feedback";

const METHOD_BADGE = {
  Cash: "bg-green-100 text-green-700",
  "Bank Transfer": "bg-blue-100 text-blue-700",
  POS: "bg-purple-100 text-purple-700",
};

const TYPE_BADGE = {
  "Full Payment": "bg-emerald-100 text-emerald-700",
  "Part Payment": "bg-orange-100 text-orange-700",
  Balance: "bg-sky-100 text-sky-700",
};

const FILTER_TABS = ["ALL", "Cash", "Bank Transfer", "POS"];

const Payments = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { data, loading, error, reload } = useApi(() => paymentsApi.list(), []);
  const payments = data || [];

  const filtered = payments.filter((p) => {
    const matchTab = activeTab === "ALL" || p.method === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.guest.toLowerCase().includes(q) ||
      p.receipt_no.toLowerCase().includes(q) ||
      p.reservation_no.toLowerCase().includes(q) ||
      p.room.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalRevenue = filtered.reduce((s, p) => s + p.amount, 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayRevenue = payments
    .filter((p) => p.date === todayStr)
    .reduce((s, p) => s + p.amount, 0);
  const fullPayments = payments.filter((p) => p.payment_type === "Full Payment").length;
  const partPayments = payments.filter((p) => p.payment_type === "Part Payment").length;

  return (
    <div className="p-6 space-y-6">
      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">
            All payment records for guest reservations
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₦${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}`,
            bg: "bg-orange-50",
            text: "text-[#C76A12]",
            sub: `${payments.length} transactions`,
          },
          {
            label: "Today's Collections",
            value: `₦${todayRevenue.toLocaleString()}`,
            bg: "bg-green-50",
            text: "text-green-700",
            sub: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
          },
          {
            label: "Full Payments",
            value: fullPayments,
            bg: "bg-blue-50",
            text: "text-blue-700",
            sub: "Fully settled reservations",
          },
          {
            label: "Part Payments",
            value: partPayments,
            bg: "bg-yellow-50",
            text: "text-yellow-700",
            sub: "Pending balance",
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-2xl p-5`}>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
              {card.label}
            </p>
            <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs tracking-wide transition-colors ${
                activeTab === tab
                  ? "bg-[#C76A12] text-white"
                  : "bg-[#ECE8E2] text-gray-600 hover:bg-[#ddd8d0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest, receipt, reservation…"
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#C76A12]/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MdPayments className="text-[#C76A12]" size={18} />
            <span className="font-medium text-gray-700">
              {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Showing total:{" "}
            <span className="font-semibold text-gray-800">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F8F6F2]">
              <tr className="text-left text-xs uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">Receipt No.</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Reservation</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-16 text-gray-400 text-sm"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 hover:bg-[#faf8f5] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {payment.receipt_no}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#C76A12] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {payment.initials}
                        </div>
                        <span className="text-sm font-medium">
                          {payment.guest}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.reservation_no}
                    </td>

                    <td className="px-6 py-4 text-sm">{payment.room}</td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-green-700">
                      ₦{payment.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          METHOD_BADGE[payment.method] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.method}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          TYPE_BADGE[payment.payment_type] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.payment_type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.staff}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 bg-gray-100 hover:bg-[#C76A12] hover:text-white rounded-full transition-colors"
                        title="View receipt"
                      >
                        <FiEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer total */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 bg-[#F8F6F2] border-t border-gray-100 flex justify-end">
            <span className="text-sm text-gray-500">
              Total collected:{" "}
              <span className="text-lg font-bold text-[#C76A12]">
                ₦{totalRevenue.toLocaleString()}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedPayment && (
        <PaymentReceiptModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default Payments;
