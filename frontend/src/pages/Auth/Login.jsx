import { Lock, Sms } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import SocialButtons from './components/SocialButtons';

export default function Login() {
  const { login, sessionExpiredMessage, clearSessionExpiredMessage } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // surfaces the reason if we were just bounced here by an expired session,
  // then clears it so it doesn't reappear on a later, unrelated visit
  useEffect(() => {
    if (sessionExpiredMessage) {
      setError(sessionExpiredMessage);
      clearSessionExpiredMessage();
    }
  }, [sessionExpiredMessage, clearSessionExpiredMessage]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      // err.response only exists if the server actually responded — no response at
      // all means the request never got there (offline, server down, timed out),
      // which isn't the same problem as a genuinely wrong email/password
      if (err.response) {
        setError('Invalid email or password.');
      } else {
        setError("We couldn't reach the server. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Login</h1>
        <p className="mt-2 text-sm tracking-[2px] text-text-secondary">
          Your data is private and encrypted, we only ask for what we need to support you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AuthInput
            label="Email Address"
            icon={<Sms variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
          <AuthInput
            label="Password"
            icon={<Lock variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-brand">
              Forgot password?
            </Link>
          </div>

          <AuthButton type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </AuthButton>

          <SocialButtons />
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
