import { useRef } from "react";
import { FiX, FiPrinter } from "react-icons/fi";

const PaymentReceiptModal = ({ payment, onClose }) => {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const content = receiptRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Receipt ${payment.receipt_no}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
            .header { text-align: center; border-bottom: 2px solid #C76A12; padding-bottom: 16px; margin-bottom: 24px; }
            .logo { font-size: 22px; font-weight: bold; color: #C76A12; }
            .sub { color: #888; font-size: 13px; margin-top: 4px; }
            .receipt-no { font-size: 13px; color: #555; margin-top: 8px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0ede8; font-size: 14px; }
            .label { color: #888; }
            .value { font-weight: 600; }
            .amount { font-size: 26px; font-weight: bold; color: #C76A12; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 32px; color: #aaa; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px; }
            .stamp { display: inline-block; border: 2px solid #16a34a; color: #16a34a; padding: 4px 16px; border-radius: 4px; font-weight: bold; font-size: 13px; margin-top: 16px; letter-spacing: 2px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-semibold">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Receipt body — also used for print */}
        <div ref={receiptRef} className="px-6 pb-4">
          {/* Header */}
          <div className="header text-center border-b-2 border-[#C76A12] pb-4 mb-5">
            <p className="logo text-2xl font-bold text-[#C76A12]">
              Dereal Stay Guest House
            </p>
            <p className="sub text-gray-500 text-xs mt-1">Payment Receipt</p>
            <p className="receipt-no text-xs text-gray-400 mt-1">
              {payment.receipt_no}
            </p>
          </div>

          {/* Amount */}
          <div className="amount text-center my-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Amount Paid
            </p>
            <p className="text-4xl font-bold text-[#C76A12]">
              ₦{payment.amount.toLocaleString()}
            </p>
          </div>

          {/* Details rows */}
          <div className="space-y-0 mt-4">
            {[
              { label: "Guest", value: payment.guest },
              { label: "Reservation", value: payment.reservation_no },
              { label: "Room", value: payment.room },
              {
                label: "Date",
                value: new Date(payment.date).toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
              { label: "Payment Method", value: payment.method },
              { label: "Payment Type", value: payment.payment_type },
              { label: "Processed By", value: payment.staff },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="row flex justify-between py-2.5 border-b border-gray-100 text-sm"
              >
                <span className="label text-gray-500">{label}</span>
                <span className="value font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          {payment.note && (
            <div className="mt-4 bg-[#FBF8F4] rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Note
              </p>
              <p className="text-sm text-gray-700">{payment.note}</p>
            </div>
          )}

          {/* Paid stamp */}
          <div className="text-center mt-5">
            <span className="stamp inline-block border-2 border-green-600 text-green-700 font-bold text-xs px-4 py-1 rounded tracking-widest">
              ✓ PAYMENT CONFIRMED
            </span>
          </div>

          {/* Footer */}
          <div className="footer text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Thank you for choosing Dereal Stay Guest House.
            </p>
            <p className="text-xs text-gray-300 mt-1">
              This is a computer-generated receipt.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C76A12] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#a85a0f] transition-colors"
          >
            <FiPrinter size={15} />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
