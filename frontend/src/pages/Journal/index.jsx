import { Microphone2, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import api from '../../services/api';
import { toDateKey } from '../../utils/date';

const MOOD_TAGS = [
  'struggling',
  'overwhelmed',
  'exhausted',
  'low',
  'anxious',
  'tired',
  'okay',
  'neutral',
  'hopeful',
  'calm',
  'grateful',
  'happy',
  'energised',
];

// today's check-in mood score -> tags worth surfacing first
const MOOD_SCORE_SUGGESTIONS = {
  1: ['struggling', 'overwhelmed', 'exhausted'],
  2: ['low', 'anxious', 'tired'],
  3: ['okay', 'neutral'],
  4: ['hopeful', 'calm', 'grateful'],
  5: ['happy', 'energised', 'grateful'],
};

function formatEntryDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function previewText(text, max = 100) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
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

export default function Journal() {
  const [bodyText, setBodyText] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [entries, setEntries] = useState([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  useEffect(() => {
    if (isListening) setBodyText(transcript);
  }, [transcript, isListening]);

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => {
        const todayCheckIn = data.find((checkin) => checkin.date === toDateKey(new Date()));
        if (todayCheckIn?.mood_score) {
          setSuggestedTags(MOOD_SCORE_SUGGESTIONS[todayCheckIn.mood_score] || []);
        }
      })
      .catch(() => setSuggestedTags([]));
  }, []);

  useEffect(() => {
    api
      .get('/api/journal/')
      .then(({ data }) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setEntriesLoaded(true));
  }, []);

  const handleDeleteEntry = async (id) => {
    try {
      await api.delete(`/api/journal/${id}/`);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch {
      // leave the card in place — the user can retry the delete
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(bodyText);
    }
  };

  const renderTagButton = (tag) => {
    const selected = moodTag === tag;
    return (
      <button
        key={tag}
        type="button"
        onClick={() => setMoodTag(selected ? '' : tag)}
        className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
          selected
            ? 'border-primary-600 bg-primary-600 text-white'
            : 'border-primary-600 bg-white text-primary-600 hover:bg-primary-50'
        }`}
      >
        {tag}
      </button>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/journal/', { body_text: bodyText, mood_tag: moodTag });
      setEntries((prev) => [data, ...prev]);
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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-white px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
          📝
        </span>
        <h1 className="text-xl font-semibold text-ink">Entry saved</h1>
        <p className="max-w-xs text-sm text-muted">Your feelings are valid.</p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button onClick={() => setSubmitted(false)}>Write another entry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink">Journal</h1>
        <p className="mt-1 text-sm text-muted">
          A private space to write down whatever is on your mind.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="rounded-card bg-white p-4 shadow-soft">
            <div className="flex items-start gap-2">
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="How are you feeling today? Write freely, this is your space."
                className="min-h-[200px] flex-1 resize-none border-0 p-0 text-base text-ink placeholder-gray-400 outline-none"
              />
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isListening ? 'animate-pulse bg-brand text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <Microphone2 variant="Linear" color="currentColor" className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              {isListening ? (
                <span className="text-xs font-medium text-red-500">Listening…</span>
              ) : (
                <span />
              )}
              <div className="text-right text-xs text-muted">{bodyText.length} characters</div>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Tag this entry</span>

            {suggestedTags.length > 0 && (
              <div className="mb-3 border-b border-gray-100 pb-3">
                <span className="mb-2 block text-xs text-muted">Suggested for today</span>
                <div className="flex flex-wrap gap-2">{suggestedTags.map(renderTagButton)}</div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {MOOD_TAGS.filter((tag) => !suggestedTags.includes(tag)).map(renderTagButton)}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting || !bodyText.trim()}>
            {submitting ? 'Saving…' : 'Save Entry'}
          </Button>
        </form>

        <div className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">My Journal</h2>

          {!entriesLoaded ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted">No entries yet. Start writing above.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-card bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted">{formatEntryDate(entry.created_at)}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry.id)}
                      aria-label="Delete entry"
                      className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash variant="Linear" color="currentColor" className="h-4 w-4" />
                    </button>
                  </div>
                  {entry.mood_tag && (
                    <span className="mt-2 inline-block rounded-pill bg-primary-100 px-3 py-1 text-xs font-medium capitalize text-primary-700">
                      {entry.mood_tag}
                    </span>
                  )}
                  <p className="mt-2 text-sm text-ink">{previewText(entry.body_text)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
