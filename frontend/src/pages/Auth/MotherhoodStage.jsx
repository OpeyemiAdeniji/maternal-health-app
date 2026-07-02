import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const STAGES = [
  { id: 'pregnant', label: "I'm pregnant" },
  { id: 'postpartum', label: "I've recently given birth" },
  { id: 'seasoned', label: "I'm a seasoned mother" },
  { id: 'exploring', label: "I'm just exploring" },
];

export default function MotherhoodStage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    // no backend field for this yet — kept locally so it's ready to wire up later
    if (selected) {
      localStorage.setItem('modacare_motherhood_stage', selected);
    }
    navigate('/healthcare-contact');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-[#2d2d2d]">Where Are You In Your Journey?</h1>
        <p className="mt-2 text-sm text-[#737373]">
          We personalize your experience and provide the right support for your current stage.
        </p>

        <div className="mt-8 space-y-3">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelected(stage.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors ${
                selected === stage.id
                  ? 'border-primary-600 bg-primary-100 text-primary-700'
                  : 'border-[#eaeaea] text-[#2d2d2d] hover:border-primary-300'
              }`}
            >
              {stage.label}
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  selected === stage.id ? 'border-primary-600 bg-primary-600' : 'border-[#bebebe]'
                }`}
              />
            </button>
          ))}
        </div>

        <Button className="mt-8" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
