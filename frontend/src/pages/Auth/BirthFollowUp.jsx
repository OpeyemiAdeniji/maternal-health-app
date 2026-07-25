import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import SelectionCard from './components/SelectionCard';
import StepCounter from './components/StepCounter';

const FEEDING_OPTIONS = ['Breastfeeding', 'Formula feeding', 'Combination feeding', 'Not sure yet'];

const TOTAL_STEPS = 2;

export default function BirthFollowUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [babyAgeMonths, setBabyAgeMonths] = useState('');
  const [feeding, setFeeding] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {};
      if (babyAgeMonths !== '') payload.baby_age_months = parseInt(babyAgeMonths, 10);
      if (feeding) payload.feeding_method = feeding;
      await api.patch('/api/auth/profile/', payload);
      navigate('/healthcare-contact');
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
            <h1 className="text-2xl font-semibold text-text-primary">How old is your baby?</h1>
            <p className="mt-2 text-sm text-text-secondary">This helps us match support to your fourth trimester.</p>
            <div className="mt-8">
              <AuthInput
                label="Baby's Age (months)"
                type="number"
                name="babyAgeMonths"
                placeholder="e.g. 3"
                value={babyAgeMonths}
                onChange={(e) => setBabyAgeMonths(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">How are you feeding your baby?</h1>
            <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest to your experience.</p>
            <div className="mt-8 space-y-3">
              {FEEDING_OPTIONS.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={feeding === option}
                  onClick={() => setFeeding(option)}
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
