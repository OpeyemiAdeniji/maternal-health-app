import axios from 'axios';
import API_BASE_URL from '../config/config';

export const ACCESS_TOKEN_KEY = 'modacare_access_token';

// set by AuthContext so a 401 can trigger a clear "session expired" message and redirect, this file has no React context of its own so it's a simple callback slot
let sessionExpiredHandler = null;
export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // only treat this as a session expiring if there was actually a token to expire, a 401 with no prior token just means "never logged in"
      const hadToken = !!localStorage.getItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      if (hadToken && sessionExpiredHandler) {
        sessionExpiredHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
