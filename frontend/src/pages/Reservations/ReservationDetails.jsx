import { useState } from "react";
import {
  FiCheckCircle,
  FiDollarSign,
  FiXCircle,
  FiUser,
  FiHome,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { payments as paymentsApi, reservations } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { ErrorBox, Loading } from "../../components/Feedback";
import AddPaymentModal from "../Payments/AddPaymentModa";
import PaymentReceiptModal from "../Payments/PaymentReceiptModal";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_COLORS = {
  CONFIRMED: "bg-orange-100 text-orange-700",
  "CHECKED-IN": "bg-green-100 text-green-700",
  "CHECKED-OUT": "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-gray-100 text-gray-700",
};

// ── component ─────────────────────────────────────────────────────────────────
// Shape the API data the way this page's markup expects.
const toDetails = (r, payments) => ({
  id: r.id,
  reservation_number: r.reservation_number,
  status: r.status,
  guest: {
    name: r.guest_detail?.name || r.guest,
    phone: r.guest_detail?.phone || "",
    email: r.guest_detail?.email || "",
    address: r.guest_detail?.address || "",
  },
  room: { room_number: r.room_number, room_type: r.room_type, rate: r.rate },
  check_in: r.checkIn,
  check_out: r.checkOut,
  duration: r.duration,
  guests_count: r.guests_count,
  amount_paid: r.amount_paid,
  total_amount: r.total_amount,
  balance: r.balance,
  staff: r.staff,
  special_requests: r.special_requests,
  timeline: [
    { title: "Reservation Created", date: fmtDate(r.created) },
    ...[...payments].reverse().map((p) => ({
      title: `Payment Received — ₦${p.amount.toLocaleString()} (${p.method})`,
      date: fmtDate(p.date),
    })),
    ...(r.status === "CANCELLED" ? [{ title: "Reservation Cancelled", date: "" }] : []),
  ],
});

const ReservationDetails = () => {
  const { id } = useParams();
  const { data, loading, error, reload } = useApi(async () => {
    const [res, pays] = await Promise.all([reservations.get(id), paymentsApi.list(id)]);
    return toDetails(res, pays);
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error || "Reservation not found."} onRetry={reload} />;
  return <ReservationDetailsView reservation={data} reload={reload} />;
};

const ReservationDetailsView = ({ reservation, reload }) => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState(null);

  const canCheckIn =
    reservation.status === "CONFIRMED" || reservation.status === "PENDING";
  const canCheckOut = reservation.status === "CHECKED-IN";
  const canCancel = !["CANCELLED", "CHECKED-OUT"].includes(reservation.status);
  const fullyPaid = reservation.balance <= 0;

  const run = async (fn) => {
    try {
      await fn();
      reload();
    } catch (e) {
      window.alert(errorMessage(e));
    }
  };

  const handleCheckIn = () => run(() => reservations.checkIn(reservation.id));
  const handleCheckOut = () => run(() => reservations.checkOut(reservation.id));

  const handleCancel = () => {
    if (!window.confirm("Cancel this reservation? This cannot be undone.")) return;
    run(() => reservations.cancel(reservation.id, "Cancelled from reservation details"));
  };

  const handlePaymentSuccess = (payment) => {
    setReceiptPayment(payment);
    reload();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/reservations")}
        className="px-3 py-2 rounded-xl bg-gray-200 flex items-center gap-2 text-sm hover:bg-gray-300 transition-colors"
      >
        <FiArrowLeft size={14} />
        Back to Reservations
      </button>

      {/* Header card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-serif">
              {reservation.reservation_number}
            </h1>
            <span
              className={`inline-block mt-2 px-4 py-1 rounded-full text-sm ${
                STATUS_COLORS[reservation.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {reservation.status}
            </span>
          </div>

          <div className="flex gap-3 flex-wrap">
            {canCheckIn && (
              <button
                onClick={handleCheckIn}
                className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-green-700 transition-colors"
              >
                <FiCheckCircle size={15} />
                Check In
              </button>
            )}

            {canCheckOut && (
              <button
                onClick={handleCheckOut}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700 transition-colors"
              >
                <FiCheckCircle size={15} />
                Check Out
              </button>
            )}

            {!fullyPaid && reservation.status !== "CANCELLED" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-[#C76A12] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-[#a85a0f] transition-colors"
              >
                <FiDollarSign size={15} />
                Add Payment
              </button>
            )}

            {fullyPaid && reservation.status !== "CANCELLED" && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                <FiCheckCircle size={15} />
                Fully Paid
              </span>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-red-700 transition-colors"
              >
                <FiXCircle size={15} />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left — details */}
        <div className="col-span-2 space-y-6">
          {/* Guest info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FiUser className="text-[#C76A12]" />
              <h2 className="font-semibold text-lg">Guest Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Full Name", value: reservation.guest.name },
                { label: "Phone", value: reservation.guest.phone || "—" },
                { label: "Email", value: reservation.guest.email || "—" },
                { label: "Address", value: reservation.guest.address || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FiHome className="text-[#C76A12]" />
              <h2 className="font-semibold text-lg">Reservation Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                {
                  label: "Room",
                  value: `Room ${reservation.room.room_number}`,
                },
                {
                  label: "Room Type",
                  value: reservation.room.room_type || "—",
                },
                { label: "Check-In", value: fmtDate(reservation.check_in) },
                { label: "Check-Out", value: fmtDate(reservation.check_out) },
                {
                  label: "Duration",
                  value: reservation.duration
                    ? `${reservation.duration} nights`
                    : "—",
                },
                { label: "Guests", value: reservation.guests_count },
                { label: "Staff On Duty", value: reservation.staff || "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Special requests */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-3">Special Requests</h2>
            <p className="text-gray-600 text-sm">
              {reservation.special_requests || "None"}
            </p>
          </div>
        </div>

        {/* Right — payment + timeline */}
        <div className="space-y-6">
          {/* Payment summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-5">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Room Rate</span>
                <span>₦{reservation.room.rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold">
                  ₦{reservation.total_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-semibold text-green-600">
                  ₦{reservation.amount_paid.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-gray-700">Balance</span>
                <span
                  className={`text-lg font-bold ${
                    reservation.balance <= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {reservation.balance <= 0
                    ? "Settled ✓"
                    : `₦${reservation.balance.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Payment progress</span>
                <span>
                  {Math.min(
                    100,
                    Math.round(
                      (reservation.amount_paid / reservation.total_amount) *
                        100,
                    ),
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#C76A12] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (reservation.amount_paid / reservation.total_amount) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            {!fullyPaid && reservation.status !== "CANCELLED" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full mt-4 py-2.5 bg-[#C76A12] text-white rounded-xl text-sm font-medium hover:bg-[#a85a0f] transition-colors"
              >
                + Add Payment
              </button>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FiCalendar className="text-[#C76A12]" />
              <h2 className="font-semibold text-lg">Activity Timeline</h2>
            </div>
            <div className="space-y-4">
              {reservation.timeline.length === 0 ? (
                <p className="text-sm text-gray-400">No activity yet.</p>
              ) : (
                reservation.timeline.map((item, i) => (
                  <div key={i} className="border-l-2 border-[#C76A12] pl-4">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <AddPaymentModal
          reservation={reservation}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Auto-show receipt after payment */}
      {receiptPayment && (
        <PaymentReceiptModal
          payment={receiptPayment}
          onClose={() => setReceiptPayment(null)}
        />
      )}
    </div>
  );
};

export default ReservationDetails;
