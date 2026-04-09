import axios from "axios";

const api = axios.create({
  // Use same-origin API requests in both local proxy and production deploys.
  baseURL: "",
  withCredentials: true
});

export async function getSong({ mood }) {
  const response = await api.get('/api/songs?mood=' + mood);
  return response.data;
}
