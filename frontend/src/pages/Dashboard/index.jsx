import { ArrowRight2, Book1, Cloud, Heart, MessageText1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { toDateKey } from '../../utils/date';

const MOOD_EMOJI = ['😔', '😕', '😐', '🙂', '😊'];
const MOOD_LABELS = ['Struggling', 'Low', 'Neutral', 'Content', 'Great'];

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

function stageBadgeLabel(user) {
  if (!user) return '';
  if (user.motherhood_stage === 'pregnant' && user.pregnancy_week) {
    const week = user.pregnancy_week;
    const trimester = week <= 12 ? 'First trimester' : week <= 27 ? 'Second trimester' : 'Third trimester';
    return `${trimester} · week ${week}`;
  }
  if (user.motherhood_stage === 'postpartum' && user.baby_age_months != null) {
    const months = user.baby_age_months;
    return `${months} month${months === 1 ? '' : 's'} postpartum`;
  }
  if (user.motherhood_stage === 'seasoned') return 'Seasoned mother';
  if (user.motherhood_stage === 'exploring') return 'Just exploring';
  return 'Postpartum';
}

function checkInStreak(checkins) {
  if (checkins.length === 0) return 0;
  const dateKeys = new Set(checkins.map((c) => c.date));
  const cursor = new Date();
  if (!dateKeys.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dateKeys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function epdsStatus(lastResult) {
  if (!lastResult) {
    return {
      badge: 'Start now',
      badgeColor: 'text-primary-600',
      body: 'Take your first wellbeing check-in.',
    };
  }

  const daysSince = Math.floor((Date.now() - new Date(lastResult.created_at)) / 86400000);

  if (daysSince < 14) {
    return {
      badge: 'Up to date',
      badgeColor: 'text-[#c3c5c4]',
      body: "You're all caught up on your wellbeing check-ins.",
    };
  }
  if (daysSince < 28) {
    return {
      badge: '2 weeks due',
      badgeColor: 'text-primary-600',
      body: 'Your next wellbeing check-in is due.',
    };
  }
  return {
    badge: 'Overdue',
    badgeColor: 'text-red-500',
    body: "It's been a while — your wellbeing check-in is overdue.",
  };
}

function CardEyebrow({ children }) {
  return <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{children}</h2>;
}

function CardEyebrowIcon({ icon, label, colorClass }) {
  return (
    <h2 className={`flex items-center gap-1 text-[13px] font-medium ${colorClass}`}>
      {icon}
      <span>{label}</span>
    </h2>
  );
}

const RELATIONSHIP_LABELS = {
  partner: 'Partner',
  friend: 'Best Friend',
  family: 'Family',
  gp: 'GP',
  midwife: 'Midwife',
};

function relationshipLabel(value) {
  if (!value) return '';
  return RELATIONSHIP_LABELS[value] || value;
}

function LoveNoteModal({ note, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 pt-16 sm:items-center">
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-soft">
        <CardEyebrow>A note for you</CardEyebrow>
        <p className="mt-3 text-base font-semibold text-ink">{note.sender_name}</p>
        {note.sender_relationship && (
          <p className="text-xs text-muted">{relationshipLabel(note.sender_relationship)}</p>
        )}
        <p className="mt-4 whitespace-pre-wrap text-sm text-ink">"{note.message_text}"</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-pill bg-brand py-3 text-sm font-semibold text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [checkInLoaded, setCheckInLoaded] = useState(false);
  const [loveBombing, setLoveBombing] = useState({ isTriggered: false, messages: [] });
  const [loveNote, setLoveNote] = useState(null);
  const [loveNoteExpanded, setLoveNoteExpanded] = useState(false);
  const [latestJournalEntry, setLatestJournalEntry] = useState(null);
  const [epdsLastResult, setEpdsLastResult] = useState(null);

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => setCheckins(data))
      .catch(() => setCheckins([]))
      .finally(() => setCheckInLoaded(true));

    api
      .get('/api/messages/love-bombing/')
      .then(({ data }) => setLoveBombing({ isTriggered: data.is_triggered, messages: data.messages }))
      .catch(() => setLoveBombing({ isTriggered: false, messages: [] }));

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
      .then(({ data }) => setEpdsLastResult(data[0] || null))
      .catch(() => setEpdsLastResult(null));
  }, []);

  const handleDismissLoveNote = () => {
    if (!loveNote) return;
    api.patch(`/api/love-notes/${loveNote.id}/read/`).catch(() => {});
    setLoveNote(null);
    setLoveNoteExpanded(false);
  };

  const todayKey = toDateKey(new Date());
  const todayCheckIn = checkins.find((c) => c.date === todayKey) || null;
  const latestCheckIn = checkins[0] || null; // /api/checkins/ is ordered newest-first
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const epds = epdsStatus(epdsLastResult);

  const streak = checkInStreak(checkins);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-[#eee] px-4 py-6">
      <div>
        <p className="text-sm font-medium text-[#1c1c1c]">
          <span className="font-semibold">{greetingWord()},</span> {user?.full_name?.split(' ')[0] || 'there'}.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#FFF0FE] px-2 py-[3px] text-xs font-medium text-[#b00fa8]">
            {stageBadgeLabel(user)}
          </span>
          <span className="rounded-full bg-[#FFE5F7] px-2 py-[3px] text-xs font-medium text-[#E65FD9]">
            Day {streak} streak
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-[24px] bg-white px-3 py-6 shadow-soft">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-medium text-black">How are you feeling today?</h2>
          <p className="text-xs leading-[1.4] tracking-[-0.12px] text-[#696969]">
            Take a quiet moment for yourself today. However you’re feeling is okay, and worth noticing.
          </p>
        </div>
        {checkInLoaded && (
          todayCheckIn ? (
            <p className="text-sm font-semibold text-green-600">Checked in today ✓</p>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/checkin')}
              className="flex items-center justify-between rounded-full bg-primary-600 p-3 text-white"
            >
              <span className="text-[13px]">Start check-in</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary-600">
                <ArrowRight2 variant="Linear" color="currentColor" className="h-3.5 w-3.5" />
              </span>
            </button>
          )
        )}
      </div>

      <div className="rounded-[24px] bg-white px-3 py-5 shadow-soft">
        <div className="flex items-center justify-between">
          <CardEyebrowIcon
            icon={<MessageText1 variant="Linear" color="currentColor" className="h-4 w-4" />}
            label="YOUR COMPANION"
            colorClass="text-[#f48b41]"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm tracking-[-0.14px] text-black">
            Moda is here whenever you need her. Tap to start a conversation.
          </p>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="flex items-center gap-1 text-[13px] text-primary-600"
          >
            Talk to Moda
            <ArrowRight2 variant="Linear" color="currentColor" className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <div className="rounded-[24px] bg-white px-3 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          <CardEyebrowIcon
            icon={<Cloud size={20} variant="Linear" color="currentColor" />}
            label="EMOTIONAL SNAPSHOT"
            colorClass="text-[#28a668]"
          />
          <button
            type="button"
            onClick={() => navigate('/mood-history')}
            className="flex items-center gap-1.5 text-sm font-medium text-[#c3c5c4]"
          >
            {monthLabel}
            <ArrowRight2 variant="Linear" color="currentColor" className="h-4 w-4" />
          </button>
        </div>
        {latestCheckIn ? (
          <div className="mt-4 flex flex-col gap-1">
            <p className="flex items-center gap-1 text-base font-medium tracking-[-0.16px] text-black">
              {MOOD_LABELS[latestCheckIn.mood_score - 1]}
              <span className="text-sm">{MOOD_EMOJI[latestCheckIn.mood_score - 1]}</span>
            </p>
            <p className="text-xs tracking-[-0.12px] text-[#696969]">
              Last checked-in . {relativeDayLabel(latestCheckIn.date)}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No check-ins yet.</p>
        )}
      </div>

      <div className="rounded-[24px] bg-white px-3 py-5 shadow-soft">
        <div className="flex items-center justify-between">
          <CardEyebrowIcon
            icon={<Book1 variant="Linear" color="currentColor" className="h-4 w-4" />}
            label="JOURNAL"
            colorClass="text-[#0187e6]"
          />
          <span className="text-sm font-medium text-[#c3c5c4]">
            {latestJournalEntry ? relativeDayLabel(latestJournalEntry.created_at.slice(0, 10)) : '—'}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <p className="truncate text-sm tracking-[-0.14px] text-black">
            {latestJournalEntry ? truncate(latestJournalEntry.body_text, 60) : "You haven't written an entry yet."}
          </p>
          <button
            type="button"
            onClick={() => navigate('/journal')}
            className="flex items-center gap-1 text-[13px] text-primary-600"
          >
            Start reflection
            <ArrowRight2 variant="Linear" color="currentColor" className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      <div className="rounded-[24px] bg-white px-3 py-5 shadow-soft">
        <div className="flex items-center justify-between">
          <CardEyebrowIcon
            icon={<Heart variant="Linear" color="currentColor" className="h-4 w-4" />}
            label="WELLBEING CHECK-UP"
            colorClass="text-[#f48b41]"
          />
          <span className={`text-sm font-medium ${epds.badgeColor}`}>{epds.badge}</span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm tracking-[-0.14px] text-black">{epds.body}</p>
          <button
            type="button"
            onClick={() => navigate('/epds')}
            className="flex items-center gap-1 text-[13px] text-primary-600"
          >
            Take assessment
            <ArrowRight2 variant="Linear" color="currentColor" className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {loveNote && (
        <button
          type="button"
          onClick={() => setLoveNoteExpanded(true)}
          className="rounded-card bg-white p-6 text-left shadow-soft"
        >
          <CardEyebrow>A note for you</CardEyebrow>
          <p className="mt-2 text-sm text-ink">
            <span className="font-semibold">{loveNote.sender_name}:</span> "{truncate(loveNote.message_text)}"
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-brand">Read →</span>
        </button>
      )}

      {loveNote && loveNoteExpanded && (
        <LoveNoteModal note={loveNote} onClose={handleDismissLoveNote} />
      )}

      {loveBombing.isTriggered && (
        <div className="rounded-card bg-white p-6 shadow-soft">
          <CardEyebrow>We see you</CardEyebrow>
          <div className="mt-3 space-y-2.5">
            {loveBombing.messages.map((message, index) => (
              <p key={index} className="flex items-start gap-2 text-sm text-ink">
                <Heart variant="Linear" color="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span>{message}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
