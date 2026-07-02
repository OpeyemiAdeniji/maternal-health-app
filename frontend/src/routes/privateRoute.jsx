import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../services/api';

// guards authenticated-only pages — no token means straight back to login
export default function PrivateRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
