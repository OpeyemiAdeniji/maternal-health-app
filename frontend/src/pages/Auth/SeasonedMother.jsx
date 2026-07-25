import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import SelectionCard from './components/SelectionCard';

const REASON_OPTIONS = [
  'Managing daily stress',
  'Connecting with other mothers',
  'Tracking my mood',
  'Seeking professional support',
];

export default function SeasonedMother() {
  const navigate = useNavigate();
  const [reason, setReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');
    setSubmitting(true);
    try {
      await api.patch('/api/auth/profile/', { stage_reason: reason || '' });
      navigate('/healthcare-contact');
    } catch {
      setError("We couldn't save your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Why are you using MODACARE?</h1>
        <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest to your experience.</p>

        <div className="mt-8 space-y-3">
          {REASON_OPTIONS.map((option) => (
            <SelectionCard
              key={option}
              label={option}
              selected={reason === option}
              onClick={() => setReason(option)}
            />
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <AuthButton className="mt-8" disabled={submitting} onClick={handleContinue}>
          {submitting ? 'Saving…' : 'Continue'}
        </AuthButton>
      </div>
    </div>
  );
}
