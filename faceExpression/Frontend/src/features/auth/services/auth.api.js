import axios from 'axios';

const isLocalHost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const apiBaseUrl = isLocalHost
  ? window.location.origin
  : (import.meta.env.VITE_API_URL || window.location.origin);

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

export async function register({ username, email, password }) {
  const response = await api.post('/api/auth/register', {
    username, email, password
  });
  return response.data;
}

export async function login({ username, email, password }) {
  const response = await api.post('/api/auth/login', {
    username, email, password
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get('/api/auth/get-me');
  return response.data;
}

export async function logout() {
  const response = await api.post('/api/auth/logout');
  return response.data;
}
