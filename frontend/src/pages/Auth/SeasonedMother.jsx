import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';
import SelectionCard from './components/SelectionCard';
import StepCounter from './components/StepCounter';

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_partnered', label: 'Married / Partnered' },
  { value: 'divorced_separated', label: 'Divorced / Separated' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'full_time', label: 'Working full-time' },
  { value: 'part_time', label: 'Working part-time' },
  { value: 'stay_at_home', label: 'Stay-at-home parent' },
  { value: 'studying', label: 'Studying' },
  { value: 'not_working', label: 'Not currently working' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const REASON_OPTIONS = [
  'Managing daily stress',
  'Connecting with other mothers',
  'Tracking my mood',
  'Seeking professional support',
];

const TOTAL_STEPS = 4;

export default function SeasonedMother() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState(null);
  const [reason, setReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = { stage_reason: reason || '' };
      if (maritalStatus) payload.marital_status = maritalStatus;
      if (numberOfChildren !== '') payload.number_of_children = parseInt(numberOfChildren, 10);
      if (employmentStatus) payload.employment_status = employmentStatus;
      const { data } = await api.patch('/api/auth/profile/', payload);
      navigate(data.onboarding_complete ? '/dashboard' : '/healthcare-contact');
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
            <h1 className="text-2xl font-semibold text-text-primary">What's your marital status?</h1>
            <p className="mt-2 text-sm text-text-secondary">
              This helps us understand your support network. Optional.
            </p>
            <div className="mt-8 space-y-3">
              {MARITAL_STATUS_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  label={option.label}
                  selected={maritalStatus === option.value}
                  onClick={() => setMaritalStatus(option.value)}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">How many children do you have?</h1>
            <p className="mt-2 text-sm text-text-secondary">
              This helps us tailor support to your household. Optional.
            </p>
            <div className="mt-8">
              <AuthInput
                label="Number of Children"
                optional
                type="number"
                name="numberOfChildren"
                placeholder="e.g. 2"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-semibold text-text-primary">What's your current work situation?</h1>
            <p className="mt-2 text-sm text-text-secondary">Pick whichever feels closest. Optional.</p>
            <div className="mt-8 space-y-3">
              {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  label={option.label}
                  selected={employmentStatus === option.value}
                  onClick={() => setEmploymentStatus(option.value)}
                />
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
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
