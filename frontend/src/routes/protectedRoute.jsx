import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../services/api';

// the inverse of privateRoute — keeps a logged-in user off the auth screens
// (Login/Register) by bouncing them to the dashboard instead
export default function ProtectedRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
