import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register({ ...form, confirmPassword: form.password });
      navigate('/motherhood-stage');
    } catch {
      setError('Something went wrong creating your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary-50 px-6 py-12">
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-soft">
        <div className="text-center">
          <Logo size="md" className="block" />
          <p className="mt-2 text-sm text-muted">Your maternal wellbeing companion</p>
        </div>

        <h1 className="mt-8 text-2xl font-semibold text-ink">Create your personal space</h1>
        <p className="mt-2 text-sm text-muted">
          We're glad you're here. Your data is private and encrypted — we only ask for what we
          need to support you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="Enter your name"
            value={form.fullName}
            onChange={handleChange}
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          <Checkbox
            label="I Agree With Terms of Service"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
