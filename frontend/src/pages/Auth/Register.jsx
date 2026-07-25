import { Lock, Profile2User, Sms } from 'iconsax-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import SocialButtons from './components/SocialButtons';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) {
    errors.fullName = 'Please enter your full name';
  }
  if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
}

function getBackendErrorMessage(err) {
  const data = err.response?.data;
  if (data?.email) return 'An account with this email already exists. Try logging in instead.';
  if (data?.password) return 'Password is too weak. Please choose a stronger password.';
  return 'Something went wrong. Please check your details and try again.';
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({});
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/motherhood-stage');
    } catch (err) {
      setError(getBackendErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Create Your Personal Space.</h1>
        <p className="mt-2 text-sm tracking-[2px] text-text-secondary">
          Your data is private and encrypted, we only ask for what we need to support you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <AuthInput
            label="Full Name"
            icon={<Profile2User variant="Linear" color="currentColor" className="h-6 w-6" />}
            name="fullName"
            placeholder="Enter your name"
            value={form.fullName}
            onChange={handleChange}
            error={fieldErrors.fullName}
          />
          <AuthInput
            label="Email Address"
            icon={<Sms variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <AuthInput
            label="Password"
            icon={<Lock variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />
          <AuthInput
            label="Confirm Password"
            icon={<Lock variant="Linear" color="currentColor" className="h-6 w-6" />}
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
          />

          <div className="flex items-center gap-2 text-sm text-text-primary">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError('');
              }}
              className="h-4 w-4 shrink-0 rounded border-gray-300 accent-brand"
            />
            <label htmlFor="agree-terms">
              I agree with the{' '}
              <Link
                to="/privacy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand underline"
              >
                Terms &amp; Conditions and Privacy Policy
              </Link>
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <AuthButton type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </AuthButton>

          <SocialButtons />
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
