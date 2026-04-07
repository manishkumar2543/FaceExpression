import axios from "axios";

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const apiBaseUrl = isLocalHost
  ? window.location.origin
  : (import.meta.env.VITE_API_URL || window.location.origin);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

export async function getSong({ mood }) {
  const response = await api.get('/api/songs?mood=' + mood);
  return response.data;
}
