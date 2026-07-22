import { Global, Heart, Profile2User } from 'iconsax-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparkleIcon } from '../../components/common/icons';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import SelectionCard from './components/SelectionCard';

const STAGES = [
  {
    id: 'pregnant',
    label: "I'm pregnant",
    icon: <Profile2User variant="Linear" color="currentColor" className="h-5 w-5" />,
    route: '/pregnant-follow-up',
  },
  {
    id: 'postpartum',
    label: 'Recently given birth',
    icon: <Heart variant="Linear" color="currentColor" className="h-5 w-5" />,
    route: '/birth-follow-up',
  },
  {
    id: 'seasoned',
    label: 'Seasoned mother',
    icon: <SparkleIcon className="h-5 w-5" />,
    route: '/seasoned-mother',
  },
  {
    id: 'exploring',
    label: 'Just exploring',
    icon: <Global variant="Linear" color="currentColor" className="h-5 w-5" />,
    route: '/exploring',
  },
];

export default function MotherhoodStage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const stage = STAGES.find((s) => s.id === selected);
    if (!stage) return;

    setError('');
    setSubmitting(true);
    try {
      await api.put('/api/auth/profile/', { motherhood_stage: stage.id });
      navigate(stage.route);
    } catch {
      setError("We couldn't save your stage. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Where Are You In Your Journey?</h1>
        <p className="mt-2 text-sm text-text-secondary">
          We personalize your experience and provide the right support for your current stage.
        </p>

        <div className="mt-8 space-y-3">
          {STAGES.map((stage) => (
            <SelectionCard
              key={stage.id}
              label={stage.label}
              icon={stage.icon}
              selected={selected === stage.id}
              onClick={() => setSelected(stage.id)}
            />
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <AuthButton className="mt-8" disabled={!selected || submitting} onClick={handleContinue}>
          {submitting ? 'Saving…' : 'Continue'}
        </AuthButton>
      </div>
    </div>
  );
}
