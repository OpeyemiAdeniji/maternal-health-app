import { Sms } from 'iconsax-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/api/auth/forgot-password/', { email });
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Check your email</h1>
        <p className="max-w-xs text-sm text-text-secondary">We have sent a reset link to {email}.</p>
        <Link to="/login" className="text-sm font-semibold text-brand">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Forgot your password?</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your email address and we will send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AuthInput
            label="Email Address"
            icon={<Sms variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <AuthButton type="submit" disabled={submitting || !email.trim()}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </AuthButton>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          <Link to="/login" className="font-semibold text-brand">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
