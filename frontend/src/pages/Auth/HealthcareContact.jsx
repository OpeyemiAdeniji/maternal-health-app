import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function HealthcareContact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    // both fields are optional, but the backend needs a complete contact if one is sent
    if (!form.name.trim() || !form.phone.trim()) {
      navigate('/dashboard');
      return;
    }

    setSubmitting(true);
    try {
      await api.patch('/api/auth/profile/', {
        healthcare_contact: { name: form.name, phone: form.phone },
      });
      navigate('/dashboard');
    } catch {
      setError("We couldn't save that contact, but you can add it later from your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-[#2d2d2d]">Your Safety Net</h1>
        <p className="mt-2 text-sm text-[#737373]">
          If you ever feel overwhelmed, who should we help you reach out to? This is optional and
          only for support.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <Input
            label="Contact Name"
            optional
            name="name"
            placeholder="E.g Partner, Doctor or Friend"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Phone Number"
            optional
            type="tel"
            name="phone"
            placeholder="+ 1 (555) 000-0000"
            value={form.phone}
            onChange={handleChange}
          />

          {error && <p className="text-sm text-[#fd4755]">{error}</p>}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save & continue'}
          </Button>
          <Button variant="text" type="button" onClick={() => navigate('/dashboard')}>
            Skip for now
          </Button>
        </form>
      </div>
    </div>
  );
}
