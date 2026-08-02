import { ArrowRight2, EmojiHappy, Health, Link, Moon, Notepad2 } from 'iconsax-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toDateKey } from '../../utils/date';

const ACCENT = '#b00fa8';
const BAR_COLOR = '#e3e3e8';
const TOOLTIP_STYLE = { borderRadius: 10, border: '1px solid #f0f0f0', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' };

const MOOD_LABELS = ['Struggling', 'Low', 'Neutral', 'Content', 'Great'];
const SLEEP_LABELS = ['Poor', 'Bad', 'Okay', 'Good', 'Great'];

function formatShortDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function last30DaysCheckins(checkins) {
  const cutoff = toDateKey(new Date(Date.now() - 30 * 86400000));
  // checkins arrive newest-first, so keep only the first occurrence per date, otherwise a day with several check-ins would show as duplicate bars and skew the average
  const mostRecentByDate = new Map();
  for (const c of checkins) {
    if (c.date >= cutoff && !mostRecentByDate.has(c.date)) {
      mostRecentByDate.set(c.date, c);
    }
  }
  return [...mostRecentByDate.values()]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((c) => ({ date: formatShortDate(c.date), mood: c.mood_score, sleep: c.sleep_score }));
}

function last30DaysJournal(entries) {
  const cutoff = Date.now() - 30 * 86400000;
  return [...entries]
    .filter((e) => e.sentiment_score != null && new Date(e.created_at).getTime() >= cutoff)
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
    .map((e) => ({
      date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: e.sentiment_score,
    }));
}

function epdsChartData(results) {
  return [...results]
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
    .map((r) => ({
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: r.score,
      fill: r.score >= 13 ? '#e2574c' : r.score >= 10 ? '#e0b13c' : '#28a668',
    }));
}

function average(list, key) {
  if (!list.length) return null;
  return list.reduce((sum, item) => sum + item[key], 0) / list.length;
}

function moodSleepInsight(insights) {
  if (!insights || insights.correlation_strength == null) {
    return "Not enough data yet to see a link between your sleep and mood — keep checking in daily and this will fill in.";
  }
  const sleepCard = (insights.insight_cards || []).find((card) => card.toLowerCase().includes('sleep'));
  if (sleepCard) return sleepCard;
  return "Your sleep and mood don't show a strong link yet — that's okay, everyone's different.";
}

function EmptyState({ children }) {
  return <p className="text-sm text-muted">{children}</p>;
}

// Apple Health "Trends" style card: icon, title, summary sentence, divider, chart, then range caption
function TrendCard({ icon, title, summary, rangeLabel, onClick, children }) {
  return (
    <section className="rounded-card bg-white p-5 shadow-soft">
      <button type="button" onClick={onClick} className="flex w-full items-center justify-between text-left">
        <span className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-[15px] font-semibold" style={{ color: ACCENT }}>
            {title}
          </span>
        </span>
        <ArrowRight2 variant="Linear" color="currentColor" className="h-4 w-4 shrink-0 text-gray-300" />
      </button>

      <p className="mt-2 text-[15px] font-medium leading-snug text-ink">{summary}</p>

      <div className="mt-4 border-t border-gray-100" />

      <div className="mt-4">{children}</div>

      {rangeLabel && <p className="mt-1 text-xs font-medium" style={{ color: ACCENT }}>{rangeLabel}</p>}
    </section>
  );
}

// thin gray bars with a solid average line and its value on the left, reused for every metric instead of a different chart per card
function TrendBarChart({ data, dataKey, domain, averageValue, averageLabel, barFill = BAR_COLOR, coloredBars = false }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 22, right: 4, left: 4, bottom: 0 }}>
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={false} />
        <YAxis domain={domain} hide />
        <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ fontWeight: 600 }} />
        {averageValue != null && (
          <ReferenceLine
            y={averageValue}
            stroke={ACCENT}
            strokeWidth={2.5}
            label={{
              value: averageLabel,
              position: 'insideTopLeft',
              fill: ACCENT,
              fontSize: 13,
              fontWeight: 700,
              offset: 6,
            }}
          />
        )}
        <Bar dataKey={dataKey} radius={[2, 2, 0, 0]} maxBarSize={coloredBars ? 28 : 6} isAnimationActive={false}>
          {coloredBars
            ? data.map((entry, index) => <Cell key={index} fill={entry.fill} />)
            : data.map((_, index) => <Cell key={index} fill={barFill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Insights() {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [epdsResults, setEpdsResults] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get('/api/checkins/'),
      api.get('/api/journal/'),
      api.get('/api/epds/'),
      api.get('/api/insights/'),
    ]).then(([checkinsRes, journalRes, epdsRes, insightsRes]) => {
      setCheckins(checkinsRes.status === 'fulfilled' ? checkinsRes.value.data : []);
      setJournalEntries(journalRes.status === 'fulfilled' ? journalRes.value.data : []);
      setEpdsResults(epdsRes.status === 'fulfilled' ? epdsRes.value.data : []);
      setInsights(insightsRes.status === 'fulfilled' ? insightsRes.value.data : null);
      setLoaded(true);
    });
  }, []);

  const moodSleepData = useMemo(() => last30DaysCheckins(checkins), [checkins]);
  const journalTrendData = useMemo(() => last30DaysJournal(journalEntries), [journalEntries]);
  const epdsData = useMemo(() => epdsChartData(epdsResults), [epdsResults]);

  const moodAvg = average(moodSleepData, 'mood');
  const sleepAvg = average(moodSleepData, 'sleep');
  const sentimentAvg = average(journalTrendData, 'sentiment');
  const epdsAvg = average(epdsData, 'score');

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-8">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 bg-[#f5f5f7] px-4 py-6">
      <h1 className="text-2xl font-bold text-ink">Your Health Trends</h1>

      <TrendCard
        icon={<EmojiHappy variant="Linear" color="#b00fa8" className="h-4 w-4" />}
        title="Mood"
        summary={
          moodSleepData.length === 0
            ? 'Log a check-in to start tracking your mood.'
            : `You averaged ${moodAvg.toFixed(1)}/5 mood (${MOOD_LABELS[Math.round(moodAvg) - 1]}) over the last 30 days.`
        }
        rangeLabel={moodSleepData.length ? '30 days' : null}
        onClick={() => navigate('/checkin')}
      >
        {moodSleepData.length === 0 ? (
          <EmptyState>No check-ins in the last 30 days yet.</EmptyState>
        ) : (
          <TrendBarChart
            data={moodSleepData}
            dataKey="mood"
            domain={[0, 5]}
            averageValue={moodAvg}
            averageLabel={`${moodAvg.toFixed(1)} mood`}
          />
        )}
      </TrendCard>

      <TrendCard
        icon={<Moon variant="Linear" color="#6fa8dc" className="h-4 w-4" />}
        title="Sleep"
        summary={
          moodSleepData.length === 0
            ? 'Log a check-in to start tracking your sleep.'
            : `You averaged ${sleepAvg.toFixed(1)}/5 sleep quality (${SLEEP_LABELS[Math.round(sleepAvg) - 1]}) over the last 30 days.`
        }
        rangeLabel={moodSleepData.length ? '30 days' : null}
        onClick={() => navigate('/checkin')}
      >
        {moodSleepData.length === 0 ? (
          <EmptyState>No check-ins in the last 30 days yet.</EmptyState>
        ) : (
          <TrendBarChart
            data={moodSleepData}
            dataKey="sleep"
            domain={[0, 5]}
            averageValue={sleepAvg}
            averageLabel={`${sleepAvg.toFixed(1)} sleep`}
          />
        )}
      </TrendCard>

      <TrendCard
        icon={<Link variant="Linear" color="#f48b41" className="h-4 w-4" />}
        title="Mood & Sleep Correlation"
        summary={moodSleepInsight(insights)}
        rangeLabel={moodSleepData.length ? '30 days' : null}
        onClick={() => navigate('/checkin')}
      >
        {moodSleepData.length === 0 ? (
          <EmptyState>Not enough check-ins yet to compare your mood and sleep.</EmptyState>
        ) : (
          <TrendBarChart
            data={moodSleepData}
            dataKey="mood"
            domain={[0, 5]}
            averageValue={moodAvg}
            averageLabel={`${moodAvg.toFixed(1)} mood`}
          />
        )}
      </TrendCard>

      <TrendCard
        icon={<Health variant="Linear" color="#10b981" className="h-4 w-4" />}
        title="EPDS History"
        summary={
          epdsData.length === 0
            ? "You haven't taken a wellbeing assessment yet."
            : `You averaged a score of ${epdsAvg.toFixed(1)} across ${epdsData.length} assessment${epdsData.length === 1 ? '' : 's'}.`
        }
        rangeLabel={epdsData.length ? `${epdsData.length} assessment${epdsData.length === 1 ? '' : 's'}` : null}
        onClick={() => navigate('/epds')}
      >
        {epdsData.length === 0 ? (
          <EmptyState>You haven't taken a wellbeing assessment yet.</EmptyState>
        ) : (
          <>
            <TrendBarChart
              data={epdsData}
              dataKey="score"
              domain={[0, 30]}
              averageValue={epdsAvg}
              averageLabel={`${epdsAvg.toFixed(1)} score`}
              coloredBars
            />
            <div className="mt-3 flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#28a668]" /> Below 10
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#e0b13c]" /> 10–12
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#e2574c]" /> 13+
              </span>
            </div>
          </>
        )}
      </TrendCard>

      <TrendCard
        icon={<Notepad2 variant="Linear" color="#8b5cf6" className="h-4 w-4" />}
        title="Journal Sentiment"
        summary={
          journalTrendData.length === 0
            ? 'Write a journal entry to start tracking your sentiment.'
            : `You averaged a sentiment score of ${sentimentAvg.toFixed(2)} across your last ${journalTrendData.length} entries.`
        }
        rangeLabel={journalTrendData.length ? '30 days' : null}
        onClick={() => navigate('/journal')}
      >
        {journalTrendData.length === 0 ? (
          <EmptyState>Write a journal entry to start tracking your sentiment over time.</EmptyState>
        ) : (
          <TrendBarChart
            data={journalTrendData}
            dataKey="sentiment"
            domain={[-1, 1]}
            averageValue={sentimentAvg}
            averageLabel={`${sentimentAvg.toFixed(2)} sentiment`}
          />
        )}
      </TrendCard>
    </div>
  );
}
