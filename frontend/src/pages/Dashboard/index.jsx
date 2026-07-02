import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const MOOD_EMOJI = ['😔', '😕', '😐', '🙂', '😊'];
const MOOD_LABELS = ['Rough', 'Low', 'Okay', 'Good', 'Great'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function last7DaysSeries(checkins) {
  const byDate = new Map(checkins.map((c) => [c.date, c.mood_score]));
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({ day: DAY_LABELS[date.getDay()], mood: byDate.get(toDateKey(date)) ?? null });
  }
  return days;
}

function computeStreak(checkins) {
  const dates = new Set(checkins.map((c) => c.date));
  const cursor = new Date();
  if (!dates.has(toDateKey(cursor))) {
    // today isn't logged yet — that doesn't break a streak that's still in progress
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (dates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [checkInLoaded, setCheckInLoaded] = useState(false);
  const [weekSeries, setWeekSeries] = useState(last7DaysSeries([]));
  const [streak, setStreak] = useState(0);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    api
      .get('/api/checkins/')
      .then(({ data }) => {
        setTodayCheckIn(data.find((checkin) => checkin.date === toDateKey(new Date())) || null);
        setWeekSeries(last7DaysSeries(data));
        setStreak(computeStreak(data));
      })
      .catch(() => setTodayCheckIn(null))
      .finally(() => setCheckInLoaded(true));

    api
      .get('/api/messages/latest/')
      .then(({ data }) => setLatestMessage(data))
      .catch(() => setLatestMessage(null));
  }, []);

  const hasWeekData = weekSeries.some((d) => d.mood !== null);
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-1 flex-col gap-6 bg-primary-50 px-6 py-8">
      <div className="rounded-card bg-gradient-to-br from-primary-100 via-primary-50 to-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">
          {greeting()}, {user?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="mt-1 text-sm text-muted">{dateLabel}</p>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">Today's check-in</h2>

        {!checkInLoaded ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : todayCheckIn ? (
          <div className="mt-4 flex flex-col items-center text-center">
            <span className="text-6xl">{MOOD_EMOJI[todayCheckIn.mood_score - 1]}</span>
            <span className="mt-2 text-base font-semibold text-primary-600">
              {MOOD_LABELS[todayCheckIn.mood_score - 1]}
            </span>
            <span className="mt-1 text-xs text-muted">
              Mood {todayCheckIn.mood_score}/5 · Sleep {todayCheckIn.sleep_score}/5
            </span>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center text-center">
            <p className="text-sm text-muted">You haven't checked in today.</p>
            <Button className="mt-4" fullWidth={false} onClick={() => navigate('/checkin')}>
              Check in now
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 rounded-card bg-white p-6 shadow-soft">
        <span className="text-3xl">🔥</span>
        <div>
          <p className="text-lg font-semibold text-ink">
            {streak} day{streak === 1 ? '' : 's'} streak
          </p>
          <p className="text-xs text-muted">
            {streak > 0 ? 'Keep it going!' : 'Check in today to start your streak.'}
          </p>
        </div>
      </div>

      <div className="rounded-card bg-white p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">This week's mood</h2>
        {hasWeekData ? (
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekSeries} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis hide domain={[1, 5]} />
                <Tooltip
                  cursor={false}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E8E3FF', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#6B4EFF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6B4EFF', strokeWidth: 0 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Check in daily to see your mood trend here.</p>
        )}
      </div>

      {latestMessage && (
        <div className="rounded-card border-l-[3px] border-primary-600 bg-white p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-ink">A message for you</h2>
          <p className="mt-2 text-sm italic text-muted">"{latestMessage.message_text}"</p>
        </div>
      )}
    </div>
  );
}
