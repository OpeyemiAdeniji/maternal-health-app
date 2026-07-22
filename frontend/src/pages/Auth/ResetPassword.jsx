import { Lock } from 'iconsax-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/auth/reset-password/', {
        token,
        new_password: form.newPassword,
        confirm_password: form.confirmPassword,
      });
      setDone(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Password updated</h1>
        <p className="max-w-xs text-sm text-text-secondary">You can now log in with your new password.</p>
        <AuthButton className="max-w-xs" onClick={() => navigate('/login')}>
          Go to login
        </AuthButton>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Create a new password</h1>
        <p className="mt-2 text-sm text-text-secondary">Choose a strong password you have not used before.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AuthInput
            label="New Password"
            icon={<Lock variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={handleChange}
          />
          <AuthInput
            label="Confirm Password"
            icon={<Lock variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <AuthButton type="submit" disabled={submitting}>
            {submitting ? 'Resetting…' : 'Reset password'}
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
