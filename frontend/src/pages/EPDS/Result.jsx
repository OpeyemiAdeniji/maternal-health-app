import { Call } from 'iconsax-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const BUCKETS = {
  low: {
    cardClass: 'border-green-200 bg-green-50',
    textClass: 'text-green-800',
    headline: 'Your responses suggest you are coping well. Keep checking in with yourself.',
    message:
      "It's wonderful that things feel manageable right now. Keep noticing the small good moments, and don't hesitate to check in again if anything changes.",
  },
  moderate: {
    cardClass: 'border-yellow-200 bg-yellow-50',
    textClass: 'text-yellow-800',
    headline: 'Your responses suggest you may be experiencing some difficulties. You are not alone in this.',
    message:
      'It could really help to talk this through with your GP or midwife — they can offer support tailored to how you are feeling.',
  },
  high: {
    cardClass: 'border-red-200 bg-red-50',
    textClass: 'text-red-800',
    headline: 'Your responses suggest you may need some additional support right now.',
    message:
      'Please reach out to someone you trust or your GP as soon as you can. You deserve support, and help is available.',
  },
};

function bucketFor(score) {
  if (score >= 13) return 'high';
  if (score >= 10) return 'moderate';
  return 'low';
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score;

  useEffect(() => {
    // no score to show — this screen only makes sense right after a submission
    if (score === undefined) {
      navigate('/dashboard', { replace: true });
    }
  }, [score, navigate]);

  if (score === undefined) return null;

  const key = bucketFor(score);
  const bucket = BUCKETS[key];

  return (
    <div className="flex flex-1 flex-col bg-white px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className={`rounded-card border p-6 shadow-soft ${bucket.cardClass}`}>
          <p className={`text-sm font-semibold ${bucket.textClass}`}>{bucket.headline}</p>
          <p className={`mt-2 text-sm ${bucket.textClass}`}>{bucket.message}</p>

          {key === 'high' && (
            <button
              type="button"
              onClick={() => navigate('/support')}
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-red-700 underline"
            >
              <Call variant="Linear" color="currentColor" className="h-4 w-4" />
              View support resources
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          This screening tool is not a diagnosis. Please speak to a healthcare professional for proper assessment.
        </p>

        <Button className="mt-8" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
