import {
  AddCircle,
  Call,
  Global,
  Heart,
  InfoCircle,
  Logout,
  Notification,
  Profile2User,
  Shield,
  Trash,
} from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { ChevronRightIcon } from '../../components/common/icons';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { requestNotificationPermission } from '../../utils/notifications';

const COUNTRY_OPTIONS = [
  { value: 'IRELAND', label: 'Ireland' },
  { value: 'UNITED_KINGDOM', label: 'United Kingdom' },
  { value: 'UNITED_STATES', label: 'United States' },
  { value: 'CANADA', label: 'Canada' },
  { value: 'AUSTRALIA', label: 'Australia' },
];

const STAGE_OPTIONS = [
  { value: 'pregnant', label: 'Pregnant', emoji: '🤰' },
  { value: 'postpartum', label: 'Recently given birth', emoji: '👶' },
  { value: 'seasoned', label: 'Seasoned mother', emoji: '👩‍👧' },
  { value: 'exploring', label: 'Just exploring', emoji: '🌸' },
];

const RELATIONSHIP_OPTIONS = [
  { value: 'partner', label: 'Partner' },
  { value: 'friend', label: 'Best Friend' },
  { value: 'family', label: 'Family' },
  { value: 'gp', label: 'GP' },
  { value: 'midwife', label: 'Midwife' },
];

function relationshipLabel(value) {
  return RELATIONSHIP_OPTIONS.find((option) => option.value === value)?.label || value;
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

function getInitials(name) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function countryLabel(value) {
  return COUNTRY_OPTIONS.find((option) => option.value === value)?.label || 'Add';
}

function stageLabel(value) {
  return STAGE_OPTIONS.find((option) => option.value === value)?.label || 'Add';
}

function validatePhone(phone) {
  if (!phone.trim()) return '';
  return phone.trim().startsWith('+') ? '' : 'Please include your country code e.g. +353871234567';
}

function Row({ icon, iconBg, label, labelClassName, value, chevron = true, expanded, onClick, rightElement, children }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <div>
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className="flex h-14 w-full items-center justify-between gap-3 px-4 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>{icon}</span>
          <span className={`truncate text-sm font-medium ${labelClassName || 'text-ink'}`}>{label}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {rightElement || (
            <>
              <span className="max-w-[120px] truncate text-sm text-muted">{value}</span>
              {chevron && (
                <ChevronRightIcon
                  className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
              )}
            </>
          )}
        </span>
      </Tag>
      {expanded && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ContactForm({ draft, onChange, onSave, onCancel, onDelete, saving, error }) {
  return (
    <div className="space-y-3">
      <Input label="Name" name="name" value={draft.name} onChange={(e) => onChange('name', e.target.value)} />
      <Input
        label={
          <span className="flex items-center gap-1.5">
            <Call variant="Linear" color="currentColor" size={16} />
            Phone
          </span>
        }
        type="tel"
        name="phone"
        placeholder="+353871234567"
        helperText="Include country code e.g. +353 for Ireland, +234 for Nigeria"
        value={draft.phone}
        onChange={(e) => onChange('phone', e.target.value)}
      />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Relationship</span>
        <select
          value={draft.relationship_type}
          onChange={(e) => onChange('relationship_type', e.target.value)}
          className="w-full rounded-input border border-gray-200 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
        >
          {RELATIONSHIP_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-4">
        <Button fullWidth={false} disabled={saving} onClick={onSave}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-muted">
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-red-600"
          >
            <Trash variant="Linear" color="currentColor" size={20} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const [accountForm, setAccountForm] = useState({ full_name: '', country: 'IRELAND', motherhood_stage: 'postpartum' });
  const [expandedAccountField, setExpandedAccountField] = useState(null);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState('');

  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [addingContact, setAddingContact] = useState(false);
  const [contactDraft, setContactDraft] = useState({ name: '', phone: '', relationship_type: 'partner' });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactError, setContactError] = useState('');

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');

  const loadProfile = () => {
    setLoading(true);
    setProfileError('');
    api
      .get('/api/auth/profile/')
      .then(({ data }) => {
        setProfile(data);
        setAccountForm({
          full_name: data.full_name || '',
          country: data.country || 'IRELAND',
          motherhood_stage: data.motherhood_stage || 'postpartum',
        });
        setNotificationsEnabled(data.notifications_enabled ?? true);
      })
      .catch(() => setProfileError("We couldn't load your profile. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();

    api
      .get('/api/contacts/')
      .then(({ data }) => setContacts(data))
      .catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    if (!notificationsSaved) return;
    const timer = setTimeout(() => setNotificationsSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [notificationsSaved]);

  const toggleAccountField = (field) => {
    setAccountError('');
    setExpandedAccountField((prev) => (prev === field ? null : field));
  };

  const saveAccountField = async () => {
    setAccountError('');
    setAccountSaving(true);
    try {
      await api.put('/api/auth/profile/', {
        full_name: accountForm.full_name,
        country: accountForm.country,
        motherhood_stage: accountForm.motherhood_stage,
      });
      setProfile((prev) => ({ ...prev, ...accountForm }));
      setExpandedAccountField(null);
    } catch (err) {
      setAccountError(extractErrorMessage(err));
    } finally {
      setAccountSaving(false);
    }
  };

  const startEditContact = (contact) => {
    setContactError('');
    setAddingContact(false);
    setEditingContactId(contact.id);
    setContactDraft({ name: contact.name, phone: contact.phone, relationship_type: contact.relationship_type });
  };

  const startAddContact = () => {
    setContactError('');
    setEditingContactId(null);
    setAddingContact(true);
    setContactDraft({ name: '', phone: '', relationship_type: 'partner' });
  };

  const cancelContactEdit = () => {
    setEditingContactId(null);
    setAddingContact(false);
    setContactError('');
  };

  const updateContactDraft = (field, value) => setContactDraft((prev) => ({ ...prev, [field]: value }));

  const saveContact = async () => {
    setContactError('');

    const phoneError = validatePhone(contactDraft.phone);
    if (phoneError) {
      setContactError(phoneError);
      return;
    }

    setContactSaving(true);
    try {
      if (addingContact) {
        const { data } = await api.post('/api/contacts/', contactDraft);
        setContacts((prev) => [...prev, data]);
        setAddingContact(false);
      } else {
        const { data } = await api.patch(`/api/contacts/${editingContactId}/`, contactDraft);
        setContacts((prev) => prev.map((c) => (c.id === editingContactId ? data : c)));
        setEditingContactId(null);
      }
    } catch (err) {
      setContactError(extractErrorMessage(err));
    } finally {
      setContactSaving(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Remove this contact?')) return;
    try {
      await api.delete(`/api/contacts/${id}/`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setEditingContactId(null);
    } catch {
      setContactError("We couldn't remove that contact. Please try again.");
    }
  };

  const handleToggleNotifications = async (next) => {
    setNotificationsError('');
    setNotificationsSaved(false);
    setNotificationsEnabled(next);
    setNotificationsSaving(true);

    if (next) {
      // best-effort — a denied browser permission shouldn't block saving the preference
      await requestNotificationPermission();
    }

    try {
      await api.put('/api/auth/profile/', {
        full_name: accountForm.full_name,
        country: accountForm.country,
        motherhood_stage: accountForm.motherhood_stage,
        notifications_enabled: next,
      });
      setNotificationsSaved(true);
    } catch (err) {
      setNotificationsEnabled(!next);
      setNotificationsError(extractErrorMessage(err));
    } finally {
      setNotificationsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#F5F5F5] px-6 py-8">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[#F5F5F5] px-6 py-8 text-center">
        <p className="text-sm text-muted">{profileError}</p>
        <button type="button" onClick={loadProfile} className="text-sm font-semibold text-brand">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F5F5F5]">
      <div className="rounded-b-[28px] bg-gradient-to-br from-brand to-[#e14bc9] px-6 pb-8 pt-10 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary-600">
          {getInitials(profile?.full_name)}
        </span>
        <h1 className="mt-4 text-xl font-bold text-white">{profile?.full_name}</h1>
        <p className="mt-1 text-sm text-white/70">{profile?.email}</p>
      </div>

      <div className="flex flex-col gap-6 px-4 py-6">
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Account</h2>
          <div className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[12px] bg-white">
            <Row
              icon={<Profile2User variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-primary-100 text-primary-600"
              label="Full Name"
              value={accountForm.full_name}
              expanded={expandedAccountField === 'full_name'}
              onClick={() => toggleAccountField('full_name')}
            >
              <Input
                label="Full name"
                name="full_name"
                value={accountForm.full_name}
                onChange={(e) => setAccountForm((prev) => ({ ...prev, full_name: e.target.value }))}
              />
              {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
              <Button className="mt-3" fullWidth={false} disabled={accountSaving} onClick={saveAccountField}>
                {accountSaving ? 'Saving…' : 'Save'}
              </Button>
            </Row>

            <Row
              icon={<Global variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-blue-100 text-blue-600"
              label="Country"
              value={countryLabel(accountForm.country)}
              expanded={expandedAccountField === 'country'}
              onClick={() => toggleAccountField('country')}
            >
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Country</span>
                <select
                  value={accountForm.country}
                  onChange={(e) => setAccountForm((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full rounded-input border border-gray-200 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                >
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
              <Button className="mt-3" fullWidth={false} disabled={accountSaving} onClick={saveAccountField}>
                {accountSaving ? 'Saving…' : 'Save'}
              </Button>
            </Row>

            <Row
              icon={<Heart variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-pink-100 text-pink-600"
              label="Stage"
              value={stageLabel(accountForm.motherhood_stage)}
              expanded={expandedAccountField === 'motherhood_stage'}
              onClick={() => toggleAccountField('motherhood_stage')}
            >
              <span className="mb-1.5 block text-sm font-medium text-ink">Motherhood stage</span>
              <div className="flex flex-col gap-2">
                {STAGE_OPTIONS.map((stage) => {
                  const active = accountForm.motherhood_stage === stage.value;
                  return (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => setAccountForm((prev) => ({ ...prev, motherhood_stage: stage.value }))}
                      className={`flex h-[52px] w-full items-center justify-between rounded-[10px] border px-4 transition-colors ${
                        active
                          ? 'border-gray-200 border-l-4 border-l-primary-600 bg-[#FFF0FE]'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm font-medium text-ink">
                        <span className="text-lg leading-none">{stage.emoji}</span>
                        {stage.label}
                      </span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          active ? 'border-primary-600' : 'border-gray-300'
                        }`}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
              <Button className="mt-3" fullWidth={false} disabled={accountSaving} onClick={saveAccountField}>
                {accountSaving ? 'Saving…' : 'Save'}
              </Button>
            </Row>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Healthcare Contact</h2>
          <div className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[12px] bg-white">
            {contacts.map((contact) => (
              <Row
                key={contact.id}
                icon={<Profile2User variant="Linear" color="currentColor" size={20} />}
                iconBg="bg-primary-100 text-primary-600"
                label={contact.name}
                value={relationshipLabel(contact.relationship_type)}
                expanded={editingContactId === contact.id}
                onClick={() =>
                  editingContactId === contact.id ? cancelContactEdit() : startEditContact(contact)
                }
              >
                <ContactForm
                  draft={contactDraft}
                  onChange={updateContactDraft}
                  onSave={saveContact}
                  onCancel={cancelContactEdit}
                  onDelete={() => deleteContact(contact.id)}
                  saving={contactSaving}
                  error={contactError}
                />
              </Row>
            ))}
            {contacts.length === 0 && !addingContact && (
              <p className="px-4 py-6 text-sm text-muted">No contacts yet.</p>
            )}
            {addingContact && (
              <div className="px-4 py-4">
                <ContactForm
                  draft={contactDraft}
                  onChange={updateContactDraft}
                  onSave={saveContact}
                  onCancel={cancelContactEdit}
                  saving={contactSaving}
                  error={contactError}
                />
              </div>
            )}
          </div>
          {!addingContact && (
            <button
              type="button"
              onClick={startAddContact}
              className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand"
            >
              <AddCircle variant="Linear" color="currentColor" size={20} />
              Add Contact
            </button>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">App</h2>
          <div className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[12px] bg-white">
            <Row
              icon={<Notification variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-primary-100 text-primary-600"
              label="Notifications"
              rightElement={
                <span className="flex items-center gap-2">
                  {notificationsSaved && <span className="text-xs font-medium text-green-600">Saved</span>}
                  <ToggleSwitch
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    disabled={notificationsSaving}
                  />
                </span>
              }
            />
            <Row
              icon={<Shield variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-gray-100 text-gray-500"
              label="Privacy Policy"
              onClick={() => navigate('/privacy')}
            />
            <Row
              icon={<InfoCircle variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-blue-100 text-blue-600"
              label="About Modacare"
              onClick={() => navigate('/about')}
            />
          </div>
          {notificationsError && <p className="mt-2 text-xs text-red-500">{notificationsError}</p>}
        </section>

        <section>
          <div className="overflow-hidden rounded-[12px] bg-red-50">
            <Row
              icon={<Logout variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-red-100 text-red-600"
              label="Log Out"
              labelClassName="text-red-600"
              chevron
              onClick={handleLogout}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
