import axios from 'axios';
import API_BASE_URL from '../config/config';

export const ACCESS_TOKEN_KEY = 'modacare_access_token';

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
    // token is gone/invalid — drop it so privateRoute sends the user back to login
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
