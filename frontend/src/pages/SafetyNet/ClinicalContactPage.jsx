import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ClinicalContactPage({ data }) {
  const moodData = data.mood_history.map((point) => ({ ...point, day: point.date.slice(5) }));
  const sleepData = data.sleep_history.map((point) => ({ ...point, day: point.date.slice(5) }));

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Clinical overview — read only
        </span>
        <h1 className="mt-1 text-2xl font-semibold text-text-primary">{data.user_name}</h1>

        <div className="mt-6 rounded-xl border border-[#e2e2e2] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Mood history</h2>
          {moodData.length > 0 ? (
            <div className="mt-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                  <YAxis hide domain={[1, 5]} />
                  <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: '1px solid #e2e2e2', fontSize: 12 }} />
                  <Line type="monotone" dataKey="mood_score" stroke="#2d2d2d" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No check-ins recorded.</p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-[#e2e2e2] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Sleep patterns</h2>
          {sleepData.length > 0 ? (
            <div className="mt-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                  <YAxis hide domain={[1, 5]} />
                  <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: '1px solid #e2e2e2', fontSize: 12 }} />
                  <Line type="monotone" dataKey="sleep_score" stroke="#737373" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No check-ins recorded.</p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-[#e2e2e2] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">EPDS scores</h2>
          {data.epds_scores.length > 0 ? (
            <div className="mt-3 divide-y divide-[#f0f0f0]">
              {data.epds_scores.map((result, index) => (
                <div key={index} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-text-secondary">{formatDate(result.created_at)}</span>
                  <span className="font-semibold text-text-primary">{result.score}/30</span>
                  {result.likely_depression ? (
                    <span className="text-xs font-semibold text-red-600">Elevated</span>
                  ) : result.positive_screen ? (
                    <span className="text-xs font-semibold text-amber-600">Positive screen</span>
                  ) : (
                    <span className="text-xs text-text-secondary">Within range</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No EPDS results recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
