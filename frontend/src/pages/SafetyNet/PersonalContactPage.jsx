import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api';

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

export default function PersonalContactPage({ data, token }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const chartData = data.mood_trend.map((point) => ({ ...point, day: point.date.slice(5) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/api/love-notes/', { token, message_text: message });
      setSent(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">{data.user_name}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Here's a gentle look at how they've been feeling lately.
        </p>

        <div className="mt-6 rounded-xl border border-[#f0e6ef] bg-white p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Mood, last 30 days</h2>
          {chartData.length > 0 ? (
            <div className="mt-3 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 11 }} />
                  <YAxis hide domain={[1, 5]} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ borderRadius: 12, border: '1px solid #f0e6ef', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood_score"
                    stroke="#b00fa8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#b00fa8', strokeWidth: 0 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No mood check-ins yet.</p>
          )}
        </div>

        {sent ? (
          <div className="mt-8 rounded-xl bg-brand/10 p-4 text-center">
            <p className="text-sm font-semibold text-brand">Your message was sent 💌</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-text-primary">Send a thoughtful message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let them know you're thinking of them…"
                rows={4}
                className="w-full rounded-xl border border-[#e2e2e2] bg-white p-3 text-base text-text-primary placeholder-[#bebebe] outline-none focus:border-brand"
              />
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="h-11 w-full rounded-xl bg-brand text-base font-semibold text-white disabled:bg-brand/40"
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
