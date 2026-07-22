import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ClinicalContactPage from './ClinicalContactPage';
import PersonalContactPage from './PersonalContactPage';

export default function SafetyNet() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/safety-net/${token}/`)
      .then(({ data }) => setData(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-6 text-center">
        <h1 className="text-xl font-semibold text-text-primary">This link isn't valid</h1>
        <p className="text-sm text-text-secondary">It may have been removed. Please check with whoever shared it.</p>
      </div>
    );
  }

  return data.view === 'clinical' ? (
    <ClinicalContactPage data={data} />
  ) : (
    <PersonalContactPage data={data} token={token} />
  );
}
