import axios from "axios";
import { API_URL } from "../config";

const ACCESS = "gh_access";
const REFRESH = "gh_refresh";
const USER = "gh_user";

export const tokenStore = {
  get access() { return localStorage.getItem(ACCESS); },
  get refresh() { return localStorage.getItem(REFRESH); },
  get user() {
    try { return JSON.parse(localStorage.getItem(USER)); } catch { return null; }
  },
  set({ access, refresh, user }) {
    if (access) localStorage.setItem(ACCESS, access);
    if (refresh) localStorage.setItem(REFRESH, refresh);
    if (user) localStorage.setItem(USER, JSON.stringify(user));
  },
  clear() {
    [ACCESS, REFRESH, USER].forEach((k) => localStorage.removeItem(k));
  },
};

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try one silent token refresh, then retry the original request.
let refreshing = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes("/auth/");
    if (error.response?.status === 401 && !original._retried && !isAuthCall && tokenStore.refresh) {
      original._retried = true;
      try {
        refreshing ??= axios
          .post(`${API_URL}/auth/refresh/`, { refresh: tokenStore.refresh })
          .finally(() => { refreshing = null; });
        const { data } = await refreshing;
        tokenStore.set({ access: data.access, refresh: data.refresh });
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        tokenStore.clear();
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

/** Turn a DRF error response into a readable string. */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!data) return error?.message === "Network Error" ? "Cannot reach the server." : fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const first = Object.entries(data)[0];
  if (!first) return fallback;
  const [field, msg] = first;
  const text = Array.isArray(msg) ? msg[0] : typeof msg === "object" ? JSON.stringify(msg) : msg;
  return field === "non_field_errors" ? text : `${field.replace(/_/g, " ")}: ${text}`;
}

export default api;
