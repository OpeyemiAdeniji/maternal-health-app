import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../services/api';

// the inverse of privateRoute, keeps a logged-in user off Login/Register by bouncing them to the dashboard
export default function ProtectedRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
