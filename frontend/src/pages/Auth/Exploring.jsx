import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import SelectionCard from './components/SelectionCard';
import StepCounter from './components/StepCounter';

const BROUGHT_HERE_OPTIONS = [
  'Curious about the app',
  'Recommended by a friend',
  'Researching for someone else',
  'Just exploring for now',
];

const SUPPORTING_OPTIONS = ['My partner', 'A friend', 'A family member', 'Someone I care for professionally'];

const TOTAL_STEPS = 2;

export default function Exploring() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [broughtHere, setBroughtHere] = useState(null);
  const [supporting, setSupporting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const stageReason = [broughtHere, supporting].filter(Boolean).join(' — ');
      // exploring-stage users skip Safety Net entirely, this is the final onboarding step for them
      await api.patch('/api/auth/profile/', { stage_reason: stageReason, onboarding_complete: true });
      navigate('/dashboard');
    } catch {
      setError("We couldn't save your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">What brought you here?</h1>
            <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest to your experience.</p>
            <div className="mt-8 space-y-3">
              {BROUGHT_HERE_OPTIONS.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={broughtHere === option}
                  onClick={() => setBroughtHere(option)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">Who are you supporting?</h1>
            <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest to your experience.</p>
            <div className="mt-8 space-y-3">
              {SUPPORTING_OPTIONS.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={supporting === option}
                  onClick={() => setSupporting(option)}
                />
              ))}
            </div>
          </>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <AuthButton className="mt-8" disabled={submitting} onClick={handleContinue}>
          {submitting ? 'Saving…' : 'Continue'}
        </AuthButton>
        <StepCounter step={step} total={TOTAL_STEPS} />
      </div>
    </div>
  );
}
