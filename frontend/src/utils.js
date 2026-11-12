export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export const fmtMoney = (n) => `₦${Number(n || 0).toLocaleString()}`;
