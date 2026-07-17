import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  HeartIcon,
  SpeakerFilledIcon,
  SpeakerIcon,
} from '../../components/common/icons';
import useAuth from '../../hooks/useAuth';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';
import api from '../../services/api';
import { toDateKey } from '../../utils/date';

const MOOD_EMOJI = ['😔', '😕', '😐', '🙂', '😊'];
const ROUTINE_ICONS = {
  breath: '🌬️',
  heart: '❤️',
  journal: '📝',
  walk: '🚶',
  water: '💧',
  rest: '😴',
  stretch: '🤸',
  gratitude: '🙏',
};

function greetingWord() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function relativeDayLabel(dateKey) {
  const today = toDateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  if (dateKey === today) return 'Today';
  if (dateKey === toDateKey(yesterdayDate)) return 'Yesterday';
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function truncate(text, max = 90) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function startOfWeek(date) {
  // weeks run Monday to Sunday
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function weekAverage(checkins, weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startKey = toDateKey(weekStart);
  const endKey = toDateKey(weekEnd);
  const inRange = checkins.filter((c) => c.date >= startKey && c.date <= endKey);
  if (inRange.length === 0) return { average: null, count: 0 };
  const total = inRange.reduce((sum, c) => sum + c.mood_score, 0);
  return { average: total / inRange.length, count: inRange.length };
}

function CardEyebrow({ children }) {
  return <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{children}</h2>;
}

function CardArrowLink({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="mt-3 text-sm font-semibold text-brand">
      {children} →
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [checkInLoaded, setCheckInLoaded] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);
  const [dailyAffirmation, setDailyAffirmation] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState({
    thisWeekAverage: null,
    thisWeekCount: 0,
    lastWeekAverage: null,
  });
  const [loveBombing, setLoveBombing] = useState({ isTriggered: false, messages: [] });
  const [loveNote, setLoveNote] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [latestJournalEntry, setLatestJournalEntry] = useState(null);
  const [epdsNextDue, setEpdsNextDue] = useState(null);
  const { speak, speakingId, isSupported: speechSupported } = useSpeechSynthesis();

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => {
        setCheckins(data);

        const thisWeekStart = startOfWeek(new Date());
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        const thisWeek = weekAverage(data, thisWeekStart);
        const lastWeek = weekAverage(data, lastWeekStart);
        setWeeklySummary({
          thisWeekAverage: thisWeek.average,
          thisWeekCount: thisWeek.count,
          lastWeekAverage: lastWeek.average,
        });
      })
      .catch(() => setCheckins([]))
      .finally(() => setCheckInLoaded(true));

    api
      .get('/api/messages/latest/')
      .then(({ data }) => setLatestMessage(data))
      .catch(() => setLatestMessage(null));

    api
      .get('/api/messages/daily-affirmation/')
      .then(({ data }) => setDailyAffirmation(data))
      .catch(() => setDailyAffirmation(null));

    api
      .get('/api/messages/love-bombing/')
      .then(({ data }) => setLoveBombing({ isTriggered: data.is_triggered, messages: data.messages }))
      .catch(() => setLoveBombing({ isTriggered: false, messages: [] }));

    api
      .get('/api/support/routine/')
      .then(({ data }) => setRoutine(data))
      .catch(() => setRoutine(null));

    api
      .get('/api/love-notes/latest/')
      .then(({ data }) => setLoveNote(data))
      .catch(() => setLoveNote(null));

    api
      .get('/api/journal/')
      .then(({ data }) => setLatestJournalEntry(data[0] || null))
      .catch(() => setLatestJournalEntry(null));

    api
      .get('/api/epds/')
      .then(({ data }) => setEpdsNextDue(data[0]?.next_due_at || null))
      .catch(() => setEpdsNextDue(null));
  }, []);

  const handleMarkLoveNoteRead = () => {
    if (!loveNote) return;
    api.patch(`/api/love-notes/${loveNote.id}/read/`).catch(() => {});
    setLoveNote(null);
  };

  const todayKey = toDateKey(new Date());
  const todayCheckIn = checkins.find((c) => c.date === todayKey) || null;
  const latestCheckIn = checkins[0] || null; // /api/checkins/ is ordered newest-first
  const affirmationText = dailyAffirmation?.message_text || 'You are doing better than you think. One day at a time.';
  const isSpeakingAffirmation = speakingId === 'affirmation';
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const epdsDaysLeft = epdsNextDue ? Math.ceil((new Date(epdsNextDue) - new Date()) / 86400000) : null;
  const epdsStatusText =
    epdsNextDue === null
      ? 'Take your first wellbeing check-in.'
      : epdsDaysLeft <= 0
      ? "It's time for your next check-up."
      : `Due in ${epdsDaysLeft} day${epdsDaysLeft === 1 ? '' : 's'}.`;

  return (
    <div className="flex flex-1 flex-col gap-6 bg-white px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            {greetingWord()}, {user?.full_name?.split(' ')[0] || 'there'}.
          </h1>
          <p className="mt-1 text-sm text-muted">{dateLabel}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          <BellIcon className="h-5 w-5" />
        </span>
      </div>

      {loveBombing.isTriggered && (
        <div className="rounded-card bg-white p-6 shadow-soft">
          <CardEyebrow>We see you</CardEyebrow>
          <div className="mt-3 space-y-2.5">
            {loveBombing.messages.map((message, index) => (
              <p key={index} className="flex items-start gap-2 text-sm text-ink">
                <HeartIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span>{message}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {loveNote && (
        <div className="rounded-card bg-white p-6 shadow-soft">
          <CardEyebrow>A note for you</CardEyebrow>
          <p className="mt-2 text-sm text-ink">
            <span className="font-semibold">{loveNote.sender_name}:</span> "{truncate(loveNote.message_text)}"
          </p>
          <CardArrowLink onClick={handleMarkLoveNoteRead}>Read</CardArrowLink>
        </div>
      )}

      <div className="rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>Your companion</CardEyebrow>
        <p className="mt-2 text-sm text-muted">Moda is here whenever you need her. Tap to start a conversation.</p>
        <CardArrowLink onClick={() => navigate('/chat')}>Talk to Moda</CardArrowLink>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>How are you feeling?</CardEyebrow>
        <p className="mt-2 text-sm text-muted">Take a quiet moment for yourself today.</p>
        {checkInLoaded && (
          todayCheckIn ? (
            <p className="mt-3 text-sm font-semibold text-green-600">Checked in today ✓</p>
          ) : (
            <CardArrowLink onClick={() => navigate('/checkin')}>Start check-in</CardArrowLink>
          )
        )}
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <CardEyebrow>Emotional snapshot</CardEyebrow>
          <span className="text-xs text-muted">{monthLabel}</span>
        </div>
        {latestCheckIn ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl">{MOOD_EMOJI[latestCheckIn.mood_score - 1]}</span>
            <span className="text-sm text-muted">Last checked-in · {relativeDayLabel(latestCheckIn.date)}</span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No check-ins yet.</p>
        )}
        <CardArrowLink onClick={() => navigate('/insights')}>View history</CardArrowLink>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>Journal</CardEyebrow>
        {latestJournalEntry ? (
          <>
            <p className="mt-1 text-xs text-muted">{relativeDayLabel(latestJournalEntry.created_at.slice(0, 10))}</p>
            <p className="mt-1 text-sm text-ink">{truncate(latestJournalEntry.body_text)}</p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">You haven't written an entry yet.</p>
        )}
        <CardArrowLink onClick={() => navigate('/journal')}>Start reflection</CardArrowLink>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>Wellbeing check-up</CardEyebrow>
        <p className="mt-2 text-sm text-muted">{epdsStatusText}</p>
        <CardArrowLink onClick={() => navigate('/epds')}>Take assessment</CardArrowLink>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <CardEyebrow>Your daily affirmation</CardEyebrow>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speak('affirmation', affirmationText)}
              aria-label={isSpeakingAffirmation ? 'Stop reading aloud' : 'Read affirmation aloud'}
              className={`flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${
                isSpeakingAffirmation ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'
              }`}
            >
              {isSpeakingAffirmation ? <SpeakerFilledIcon className="h-4 w-4" /> : <SpeakerIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
        <p className="mt-3 text-base italic text-ink">"{affirmationText}"</p>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>This week</CardEyebrow>
        {weeklySummary.thisWeekCount < 3 ? (
          <p className="mt-3 text-sm text-muted">Not enough data yet. Keep checking in.</p>
        ) : (
          <>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-semibold text-ink">{weeklySummary.thisWeekAverage.toFixed(1)}</span>
              {weeklySummary.lastWeekAverage !== null &&
                (weeklySummary.thisWeekAverage >= weeklySummary.lastWeekAverage ? (
                  <ArrowUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 text-red-500" />
                ))}
            </div>
            <p className="mt-1 text-xs text-muted">
              Last week: {weeklySummary.lastWeekAverage !== null ? weeklySummary.lastWeekAverage.toFixed(1) : '—'}
            </p>
          </>
        )}
      </div>

      {routine && (
        <div className="rounded-card bg-white p-6 shadow-soft">
          <CardEyebrow>Today's self-care</CardEyebrow>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl">{ROUTINE_ICONS[routine.icon] || '🌿'}</span>
            <h3 className="text-base font-bold text-ink">{routine.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted">{routine.description}</p>
          <span className="mt-3 inline-block rounded-pill bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
            {routine.duration}
          </span>
        </div>
      )}

      {latestMessage && (
        <div className="rounded-card bg-white p-6 shadow-soft">
          <CardEyebrow>A message for you</CardEyebrow>
          <p className="mt-2 text-sm italic text-muted">"{latestMessage.message_text}"</p>
        </div>
      )}
    </div>
  );
}
