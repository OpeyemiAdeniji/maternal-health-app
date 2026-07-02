import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './routes';
import PrivateRoute from './routes/privateRoute';
import ProtectedRoute from './routes/protectedRoute';
import Main from './layouts/Main';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MotherhoodStage from './pages/Auth/MotherhoodStage';
import HealthcareContact from './pages/Auth/HealthcareContact';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Journal from './pages/Journal';
import EPDS from './pages/EPDS';
import Support from './pages/Support';
import Insights from './pages/Insights';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* onboarding steps run right after registration, while already authenticated */}
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.MOTHERHOOD_STAGE} element={<MotherhoodStage />} />
            <Route path={ROUTES.HEALTHCARE_CONTACT} element={<HealthcareContact />} />

            <Route element={<Main />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CHECKIN} element={<CheckIn />} />
              <Route path={ROUTES.JOURNAL} element={<Journal />} />
              <Route path={ROUTES.EPDS} element={<EPDS />} />
              <Route path={ROUTES.SUPPORT} element={<Support />} />
              <Route path={ROUTES.INSIGHTS} element={<Insights />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
