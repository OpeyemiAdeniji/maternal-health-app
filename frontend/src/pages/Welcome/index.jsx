import { useNavigate } from 'react-router-dom';
import pregnantWomanIllustration from '../../assets/images/pregnant-woman.svg';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-10 pt-14">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <p className="text-center text-sm font-bold uppercase tracking-[4px] text-primary-600">
          Modacare
        </p>

        <div className="flex flex-1 items-center justify-center">
          <img
            src={pregnantWomanIllustration}
            alt="Illustration of a pregnant woman resting calmly, representing maternal wellbeing and care"
            className="h-64 w-64"
          />
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold leading-tight text-text-primary">
            Mom's personal mental health companion.
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            A supportive companion for your maternal mental health journey.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="h-12 w-full rounded-pill bg-brand text-base font-semibold text-white transition-colors active:bg-primary-700"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="h-12 w-full rounded-pill border border-brand bg-white text-base font-semibold text-brand transition-colors active:bg-primary-50"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
