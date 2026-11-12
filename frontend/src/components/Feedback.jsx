export const Loading = ({ text = "Loading…" }) => (
  <div className="p-10 text-center text-gray-500">{text}</div>
);

export const ErrorBox = ({ message, onRetry }) => (
  <div className="m-6 p-5 rounded-2xl bg-red-50 text-red-700 flex items-center justify-between gap-4">
    <span>{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm">
        Retry
      </button>
    )}
  </div>
);

export const FormError = ({ message }) =>
  message ? <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{message}</p> : null;
