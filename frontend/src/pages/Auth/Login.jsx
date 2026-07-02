import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
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

        <h1 className="mt-8 text-2xl font-semibold text-ink">Welcome back</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="text-right">
            {/* password reset isn't built yet — kept as a visual placeholder to match the design */}
            <span className="text-sm font-medium text-primary-600">Forgot password?</span>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
