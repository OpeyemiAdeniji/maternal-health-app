import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import SelectionCard from './components/SelectionCard';
import StepCounter from './components/StepCounter';

const DESCRIPTION_OPTIONS = [
  'First pregnancy',
  "I've been through this before",
  'High-risk pregnancy',
  'Twins or multiples',
];

const TOTAL_STEPS = 3;

export default function PregnantFollowUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [description, setDescription] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {};
      if (weeksPregnant !== '') payload.pregnancy_week = parseInt(weeksPregnant, 10);
      if (dueDate) payload.due_date = dueDate;
      await api.put('/api/auth/profile/', payload);
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
            <h1 className="text-2xl font-semibold text-text-primary">How far along is your pregnancy?</h1>
            <p className="mt-2 text-sm text-text-secondary">This helps us tailor guidance to your trimester.</p>
            <div className="mt-8">
              <AuthInput
                label="Weeks Pregnant"
                type="number"
                name="weeksPregnant"
                placeholder="e.g. 12"
                value={weeksPregnant}
                onChange={(e) => setWeeksPregnant(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">What best describes your pregnancy?</h1>
            <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest to your experience.</p>
            <div className="mt-8 space-y-3">
              {DESCRIPTION_OPTIONS.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={description === option}
                  onClick={() => setDescription(option)}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">Would you like to save your due date?</h1>
            <p className="mt-2 text-sm text-text-secondary">Optional — you can always add this later.</p>
            <div className="mt-8">
              <AuthInput
                label="Due Date"
                optional
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
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
