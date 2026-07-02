import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';

const MOOD_TAGS = ['Anxious', 'Hopeful', 'Tired', 'Calm', 'Overwhelmed', 'Grateful'];

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

export default function Journal() {
  const navigate = useNavigate();
  const [bodyText, setBodyText] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/api/journal/', { body_text: bodyText, mood_tag: moodTag });
      setSubmitted(true);
      setBodyText('');
      setMoodTag('');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-primary-50 px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
          📝
        </span>
        <h1 className="text-xl font-semibold text-ink">Entry saved</h1>
        <p className="max-w-xs text-sm text-muted">Your feelings are valid.</p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button onClick={() => setSubmitted(false)}>Write another entry</Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-primary-50 px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink">Journal</h1>
        <p className="mt-1 text-sm text-muted">
          A private space to write down whatever is on your mind.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="rounded-card bg-white p-4 shadow-soft">
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="How are you feeling today? Write freely, this is your space."
              className="min-h-[200px] w-full resize-none border-0 p-0 text-base text-ink placeholder-gray-400 outline-none"
            />
            <div className="text-right text-xs text-muted">{bodyText.length} characters</div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Tag this entry</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {MOOD_TAGS.map((tag) => {
                const selected = moodTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setMoodTag(selected ? '' : tag)}
                    className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      selected
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-primary-600 bg-white text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting || !bodyText.trim()}>
            {submitting ? 'Saving…' : 'Save Entry'}
          </Button>
        </form>
      </div>
    </div>
  );
}
