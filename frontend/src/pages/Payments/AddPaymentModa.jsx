import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiDollarSign } from "react-icons/fi";
import { payments } from "../../services/guesthouse";
import { errorMessage } from "../../services/api";
import { FormError } from "../../components/Feedback";

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "POS"];

const AddPaymentModal = ({ reservation, onClose, onSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const amountEntered = Number(watch("amount") || 0);
  const balance = reservation.balance;
  const isOverpayment = amountEntered > balance;
  const willSettle = amountEntered >= balance;

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError("");
    try {
      const created = await payments.create({
        reservation: reservation.id,
        amount: data.amount,
        method: data.method,
        note: data.note,
      });
      onSuccess?.(created);
      onClose();
    } catch (e) {
      setServerError(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C76A12] text-white flex items-center justify-center">
              <FiDollarSign size={15} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Add Payment</h2>
              <p className="text-xs text-gray-400">
                {reservation.reservation_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Balance summary */}
        <div className="mx-6 mt-4 bg-red-50 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Outstanding Balance
            </p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">
              ₦{balance.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Guest</p>
            <p className="text-sm font-medium">{reservation.guest.name}</p>
            <p className="text-xs text-gray-400">{reservation.room.room_number}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
              Amount (₦) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                ₦
              </span>
              <input
                type="number"
                min={1}
                max={balance}
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be greater than 0" },
                  max: {
                    value: balance,
                    message: `Amount cannot exceed balance of ₦${balance.toLocaleString()}`,
                  },
                })}
                placeholder="0"
                className={`w-full pl-7 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C76A12]/30 ${
                  errors.amount ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}

            {/* Live indicator */}
            {amountEntered > 0 && !isOverpayment && (
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>
                  Remaining after payment:{" "}
                  <span
                    className={`font-semibold ${
                      willSettle ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    ₦{Math.max(0, balance - amountEntered).toLocaleString()}
                  </span>
                </span>
                {willSettle && (
                  <span className="text-green-600 font-medium">
                    ✓ Fully settled
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
              Payment Method *
            </label>
            <select
              {...register("method", { required: "Select a payment method" })}
              className={`w-full border py-3 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C76A12]/30 ${
                errors.method ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            >
              <option value="">Select method…</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="text-xs text-red-500 mt-1">
                {errors.method.message}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
              Note (optional)
            </label>
            <textarea
              rows={2}
              {...register("note")}
              placeholder="e.g. Balance cleared on checkout…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C76A12]/30 resize-none"
            />
          </div>

          <FormError message={serverError} />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-[#C76A12] text-white text-sm font-medium hover:bg-[#a85a0f] transition-colors disabled:opacity-60"
            >
              {submitting ? "Recording…" : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
