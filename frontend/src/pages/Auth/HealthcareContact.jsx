import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthButton from './components/AuthButton';
import AuthInput from './components/AuthInput';

const RELATIONSHIP_OPTIONS = [
  { value: 'partner', label: 'Partner' },
  { value: 'friend', label: 'Best Friend' },
  { value: 'family', label: 'Family' },
  { value: 'gp', label: 'GP' },
  { value: 'midwife', label: 'Midwife' },
];

function blankContact() {
  return { name: '', phone: '', relationship_type: 'partner' };
}

function validatePhone(phone) {
  if (!phone.trim()) return '';
  return phone.trim().startsWith('+') ? '' : 'Please include your country code e.g. +353871234567';
}

export default function HealthcareContact() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([blankContact()]);
  const [error, setError] = useState('');
  const [phoneErrors, setPhoneErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const updateContact = (index, field, value) => {
    setContacts((prev) => prev.map((contact, i) => (i === index ? { ...contact, [field]: value } : contact)));
    if (field === 'phone') {
      setPhoneErrors((prev) => ({ ...prev, [index]: '' }));
    }
  };

  const addContact = () => setContacts((prev) => [...prev, blankContact()]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const newPhoneErrors = {};
    contacts.forEach((contact, index) => {
      const phoneError = validatePhone(contact.phone);
      if (phoneError) newPhoneErrors[index] = phoneError;
    });
    if (Object.keys(newPhoneErrors).length > 0) {
      setPhoneErrors(newPhoneErrors);
      return;
    }

    // both fields are optional overall, but a contact needs both to be worth saving
    const complete = contacts.filter((contact) => contact.name.trim() && contact.phone.trim());
    if (complete.length === 0) {
      navigate('/motherhood-stage');
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(complete.map((contact) => api.post('/api/contacts/', contact)));
      navigate('/motherhood-stage');
    } catch {
      setError("We couldn't save your contacts, but you can add them later from your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text-primary">Your Safety Net</h1>
        <p className="mt-2 text-sm text-text-secondary">
          If you ever feel overwhelmed, who should we help you reach out to? This is optional and
          only for support.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          {contacts.map((contact, index) => (
            <div key={index} className="space-y-5 border-b border-[#f0f0f0] pb-8 last:border-0 last:pb-0">
              <AuthInput
                label="Contact Name"
                optional
                name={`name-${index}`}
                placeholder="E.g Partner, Doctor or Friend"
                value={contact.name}
                onChange={(e) => updateContact(index, 'name', e.target.value)}
              />
              <AuthInput
                label="Phone Number"
                optional
                type="tel"
                name={`phone-${index}`}
                placeholder="+353871234567"
                helperText="Include country code e.g. +353 for Ireland, +234 for Nigeria"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
                error={phoneErrors[index]}
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-text-primary">Relationship Type</span>
                <select
                  value={contact.relationship_type}
                  onChange={(e) => updateContact(index, 'relationship_type', e.target.value)}
                  className="h-[46px] w-full border-b border-[#c5c5c5] bg-transparent text-base text-text-primary outline-none focus:border-brand"
                >
                  {RELATIONSHIP_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}

          <button type="button" onClick={addContact} className="text-sm font-semibold text-brand">
            + Add another contact
          </button>

          {error && <p className="text-sm text-[#fd4755]">{error}</p>}

          <AuthButton type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save & Continue'}
          </AuthButton>
          <AuthButton variant="secondary" type="button" onClick={() => navigate('/motherhood-stage')}>
            Skip for now
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
