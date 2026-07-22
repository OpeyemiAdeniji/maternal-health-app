import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ROUTES } from './routes';
import PrivateRoute from './routes/privateRoute';
import ProtectedRoute from './routes/protectedRoute';
import Main from './layouts/Main';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import HealthcareContact from './pages/Auth/HealthcareContact';
import MotherhoodStage from './pages/Auth/MotherhoodStage';
import PregnantFollowUp from './pages/Auth/PregnantFollowUp';
import BirthFollowUp from './pages/Auth/BirthFollowUp';
import SeasonedMother from './pages/Auth/SeasonedMother';
import Exploring from './pages/Auth/Exploring';
import SafetyNet from './pages/SafetyNet';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Journal from './pages/Journal';
import Chat from './pages/Chat';
import EPDS from './pages/EPDS';
import EPDSResult from './pages/EPDS/Result';
import Support from './pages/Support';
import Insights from './pages/Insights';
import MoodHistory from './pages/MoodHistory';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

          {/* public — opened from a Safety Net contact's own link, no login involved */}
          <Route path={ROUTES.SAFETY_NET} element={<SafetyNet />} />

          {/* public — reachable whether or not the user is logged in */}
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* onboarding steps run right after registration, while already authenticated:
              Register -> HealthcareContact -> MotherhoodStage -> stage-specific follow-up -> Dashboard */}
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.HEALTHCARE_CONTACT} element={<HealthcareContact />} />
            <Route path={ROUTES.MOTHERHOOD_STAGE} element={<MotherhoodStage />} />
            <Route path={ROUTES.PREGNANT_FOLLOW_UP} element={<PregnantFollowUp />} />
            <Route path={ROUTES.BIRTH_FOLLOW_UP} element={<BirthFollowUp />} />
            <Route path={ROUTES.SEASONED_MOTHER} element={<SeasonedMother />} />
            <Route path={ROUTES.EXPLORING} element={<Exploring />} />

            <Route element={<Main />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CHECKIN} element={<CheckIn />} />
              <Route path={ROUTES.JOURNAL} element={<Journal />} />
              <Route path={ROUTES.CHAT} element={<Chat />} />
              <Route path={ROUTES.EPDS} element={<EPDS />} />
              <Route path={ROUTES.EPDS_RESULT} element={<EPDSResult />} />
              <Route path={ROUTES.SUPPORT} element={<Support />} />
              <Route path={ROUTES.INSIGHTS} element={<Insights />} />
              <Route path={ROUTES.MOOD_HISTORY} element={<MoodHistory />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.PRIVACY} element={<Privacy />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
