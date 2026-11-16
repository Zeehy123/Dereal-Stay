import api from "./api";

// ---------- helpers: convert between API values and the labels the UI uses ----------
const title = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : s);
export const uiStatus = (s) => (s ? s.replace(/_/g, "-") : s); // CHECKED_IN -> CHECKED-IN
export const apiStatus = (s) => (s ? s.replace(/-/g, "_") : s);

const METHOD_LABEL = { CASH: "Cash", TRANSFER: "Bank Transfer", POS: "POS" };
const METHOD_VALUE = { Cash: "CASH", "Bank Transfer": "TRANSFER", POS: "POS" };

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const list = (data) => (Array.isArray(data) ? data : data.results ?? []);

// ---------- rooms ----------
const roomFromApi = (r) => ({
  ...r,
  room_type: title(r.room_type),
  price_per_night: Number(r.price_per_night),
  amenities: r.amenities || [],
  current_guest: r.current_guest || null,
  reservations: (r.reservations || []).map((x) => ({ ...x, status: uiStatus(x.status) })),
});
const roomToApi = (d) => ({
  room_number: d.room_number,
  room_name: d.room_name || "",
  room_type: String(d.room_type || "Standard").toUpperCase(),
  floor: Number(d.floor),
  price_per_night: Number(d.price_per_night),
  max_guests: Number(d.max_guests),
  amenities: d.amenities ? [].concat(d.amenities) : [],
  status: d.status || "AVAILABLE",
});

export const rooms = {
  list: async () => list((await api.get("/rooms/")).data).map(roomFromApi),
  get: async (id) => roomFromApi((await api.get(`/rooms/${id}/`)).data),
  create: async (d) => roomFromApi((await api.post("/rooms/", roomToApi(d))).data),
  update: async (id, d) => roomFromApi((await api.put(`/rooms/${id}/`, roomToApi(d))).data),
  remove: (id) => api.delete(`/rooms/${id}/`),
};

// ---------- guests ----------
const guestFromApi = (g) => ({
  ...g,
  phone: g.phone_number,
  reservations: g.reservations_count,
  total_spent: Number(g.total_spent || 0),
  last_visit: g.last_visit
    ? new Date(g.last_visit).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "—",
});
const guestToApi = (d) => ({
  first_name: d.first_name,
  last_name: d.last_name,
  phone_number: d.phone_number,
  email: d.email || null,
  address: d.address || null,
  nationality: d.nationality || null,
  id_type: d.id_type || null,
  id_number: d.id_number || null,
  notes: d.notes || null,
});

export const guests = {
  list: async () => list((await api.get("/guests/")).data).map(guestFromApi),
  get: async (id) => (await api.get(`/guests/${id}/`)).data,
  create: async (d) => (await api.post("/guests/", guestToApi(d))).data,
  update: async (id, d) => (await api.put(`/guests/${id}/`, guestToApi(d))).data,
  remove: (id) => api.delete(`/guests/${id}/`),
};

// ---------- reservations ----------
export const reservationFromApi = (r) => ({
  id: r.id,
  reservation_number: r.reservation_number,
  initials: initials(r.guest_name),
  guest: r.guest_name,
  guest_id: r.guest,
  guest_detail: r.guest_detail,
  room: `Room ${r.room_number}`,
  room_id: r.room,
  room_number: r.room_number,
  room_type: title(r.room_type),
  rate: Number(r.price_per_night),
  checkIn: r.check_in_date,
  checkOut: r.check_out_date,
  duration: r.duration_of_stay,
  guests_count: r.number_of_guests,
  special_requests: r.special_requests,
  total_amount: Number(r.total_amount),
  amount_paid: Number(r.amount_paid),
  balance: Number(r.balance),
  paid: `₦${Number(r.amount_paid).toLocaleString()}`,
  balanceLabel: `₦${Number(r.balance).toLocaleString()}`,
  staff: r.staff_name || "—",
  status: uiStatus(r.status),
  created: r.reservation_date,
});

const reservationToApi = (d) => ({
  guest: Number(d.guest),
  room: Number(d.room),
  check_in_date: d.check_in_date,
  check_out_date: d.check_out_date,
  number_of_guests: Number(d.number_of_guests || 1),
  special_requests: d.special_requests || "",
  ...(d.status ? { status: apiStatus(d.status) } : {}),
  ...(d.initial_payment ? { initial_payment: Number(d.initial_payment) } : {}),
});

export const reservations = {
  list: async () => list((await api.get("/reservations/")).data).map(reservationFromApi),
  get: async (id) => reservationFromApi((await api.get(`/reservations/${id}/`)).data),
  create: async (d) => reservationFromApi((await api.post("/reservations/", reservationToApi(d))).data),
  update: async (id, d) => reservationFromApi((await api.patch(`/reservations/${id}/`, reservationToApi(d))).data),
  checkIn: async (id) => reservationFromApi((await api.post(`/reservations/${id}/check-in/`)).data),
  checkOut: async (id) => reservationFromApi((await api.post(`/reservations/${id}/check-out/`)).data),
  cancel: async (id, reason) => reservationFromApi((await api.post(`/reservations/${id}/cancel/`, { reason })).data),
};

// ---------- payments ----------
const paymentFromApi = (p) => ({
  id: p.id,
  receipt_no: p.receipt_no,
  reservation_id: p.reservation,
  reservation_no: p.reservation_number,
  guest: p.guest_name,
  initials: initials(p.guest_name),
  room: `Room ${p.room_number}`,
  date: p.payment_date,
  amount: Number(p.amount),
  method: METHOD_LABEL[p.payment_method] || p.payment_method,
  payment_type: p.payment_type,
  staff: p.staff_name || "—",
  note: p.notes || "",
});

export const payments = {
  list: async (reservationId) =>
    list((await api.get("/payments/", { params: reservationId ? { reservation: reservationId } : {} })).data).map(paymentFromApi),
  create: async ({ reservation, amount, method, note }) =>
    paymentFromApi(
      (await api.post("/payments/", {
        reservation,
        amount: Number(amount),
        payment_method: METHOD_VALUE[method] || "CASH",
        notes: note || "",
      })).data,
    ),
};

// ---------- dashboard ----------
export const dashboard = {
  get: async () => {
    const d = (await api.get("/dashboard/")).data;
    const row = (r) => ({
      ...r,
      initials: initials(r.guest),
      guestsCount: r.guests_count,
      room: `Room ${r.room}`,
      amount: Number(r.amount),
      status: uiStatus(r.status),
    });
    return { ...d, recent_bookings: d.recent_bookings.map(row), upcoming_checkouts: d.upcoming_checkouts.map(row) };
  },
};

export const auth = {
  login: async (username, password) => (await api.post("/auth/login/", { username, password })).data,
};

export const staffUsers = {
  create: async (data) => (await api.post("/auth/users/", data)).data,
};
