import { TickCircle } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';

const MOOD_OPTIONS = [
  { value: 1, emoji: '😔', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

const SLEEP_OPTIONS = [
  { value: 1, emoji: '😴', label: 'Poor' },
  { value: 2, emoji: '😪', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😌', label: 'Good' },
  { value: 5, emoji: '✨', label: 'Great' },
];

function formatCheckinDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCheckinTime(createdAt) {
  return new Date(createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

function ScaleSelector({ name, options, value, onChange }) {
  return (
    <div className="flex justify-between">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            name={name}
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(10);
              onChange(option.value);
            }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-all duration-200 ${
                selected ? 'border-primary-600 bg-primary-600' : 'border-gray-200 bg-white'
              }`}
            >
              <span
                className={`inline-block transition-transform duration-200 ${selected ? 'scale-125' : 'scale-100'}`}
              >
                {option.emoji}
              </span>
            </span>
            <span
              className={`text-xs transition-colors ${
                selected ? 'font-bold text-primary-600' : 'font-medium text-muted'
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SuccessCheck() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={`flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 transition-all duration-500 ${
        shown ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}
    >
      <TickCircle variant="Linear" color="currentColor" className="h-11 w-11" />
    </span>
  );
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [moodScore, setMoodScore] = useState(null);
  const [sleepScore, setSleepScore] = useState(null);
  const [triggerNote, setTriggerNote] = useState('');
  const [error, setError] = useState('');
  const [supportiveMessage, setSupportiveMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const canSubmit = moodScore && sleepScore && !submitting;

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => setHistory(data.slice(0, 7))) // already ordered newest-first
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoaded(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/checkins/', {
        mood_score: moodScore,
        sleep_score: sleepScore,
        trigger_note: triggerNote,
      });

      // the checkin response doesn't always carry a message, fall back to the latest one
      let message = data.supportive_message?.message_text;
      if (!message) {
        try {
          const latest = await api.get('/api/messages/latest/');
          message = latest.data.message_text;
        } catch {
          // no supportive message available yet, that's fine
        }
      }
      setSupportiveMessage(message || 'Thanks for checking in today.');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (supportiveMessage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-16 text-center">
        <SuccessCheck />
        <h1 className="text-xl font-semibold text-ink">Check-in saved</h1>
        <p className="max-w-xs text-sm text-muted">{supportiveMessage}</p>
        <Button fullWidth={false} onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white px-6 py-10">
      <h1 className="text-center text-2xl font-semibold text-ink">How are you today?</h1>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-md space-y-6">
        <div className="rounded-card bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-sm font-semibold text-ink">Mood</h2>
          <ScaleSelector name="mood_score" options={MOOD_OPTIONS} value={moodScore} onChange={setMoodScore} />
        </div>

        <div className="rounded-card bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-sm font-semibold text-ink">Sleep</h2>
          <ScaleSelector name="sleep_score" options={SLEEP_OPTIONS} value={sleepScore} onChange={setSleepScore} />
        </div>

        <label className="block">
          <textarea
            name="trigger_note"
            value={triggerNote}
            onChange={(e) => setTriggerNote(e.target.value)}
            placeholder="Anything on your mind today? (optional)"
            rows={4}
            className="w-full rounded-input border border-gray-200 bg-white px-4 py-3 text-base text-ink placeholder-gray-400 outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={!canSubmit}>
          {submitting ? 'Submitting…' : 'Submit check-in'}
        </Button>
      </form>

      <div className="mx-auto mt-10 w-full max-w-md">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Recent Check-ins</h2>

        {!historyLoaded ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted">No check-ins yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((checkin) => (
              <div key={checkin.id} className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft">
                <span className="flex w-14 shrink-0 flex-col text-xs text-muted">
                  <span>{formatCheckinDate(checkin.date)}</span>
                  <span className="text-[10px] text-gray-400">{formatCheckinTime(checkin.created_at)}</span>
                </span>
                <span className="flex flex-col items-center">
                  <span className="text-xl">{MOOD_OPTIONS[checkin.mood_score - 1]?.emoji}</span>
                  <span className="text-[10px] text-muted">{MOOD_OPTIONS[checkin.mood_score - 1]?.label}</span>
                </span>
                <span className="flex flex-col items-center">
                  <span className="text-xl">{SLEEP_OPTIONS[checkin.sleep_score - 1]?.emoji}</span>
                  <span className="text-[10px] text-muted">{SLEEP_OPTIONS[checkin.sleep_score - 1]?.label}</span>
                </span>
                {checkin.trigger_note && <span className="truncate text-sm text-muted">{checkin.trigger_note}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
