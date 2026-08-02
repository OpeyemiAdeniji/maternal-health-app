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

const FEEDING_OPTIONS = [
  { value: 'Breastfeeding', label: 'Breastfeeding' },
  { value: 'Formula feeding', label: 'Formula feeding' },
  { value: 'Combination feeding', label: 'Combination feeding' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married_partnered', label: 'Married / Partnered' },
  { value: 'divorced_separated', label: 'Divorced / Separated' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'full_time', label: 'Working full-time' },
  { value: 'part_time', label: 'Working part-time' },
  { value: 'stay_at_home', label: 'Stay-at-home parent' },
  { value: 'studying', label: 'Studying' },
  { value: 'not_working', label: 'Not currently working' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

function optionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || 'Add';
}

function numberOrAdd(value) {
  return value || value === 0 ? value : 'Add';
}

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

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-input border border-gray-200 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      >
        <option value="">Not set</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChangeStageConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 pt-16 sm:items-center">
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-soft">
        <h2 className="text-base font-semibold text-ink">Change your stage?</h2>
        <p className="mt-2 text-sm text-muted">
          This will update the content and support tailored to you — continue?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-pill border border-gray-200 py-3 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-pill bg-brand py-3 text-sm font-semibold text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountConfirmModal({ password, onPasswordChange, onConfirm, onCancel, saving, error }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 pt-16 sm:items-center">
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-soft">
        <h2 className="text-base font-semibold text-ink">Delete your account?</h2>
        <p className="mt-2 text-sm text-muted">
          This permanently deletes your check-ins, journal, chat history, EPDS results, and Safety Net
          contacts. This cannot be undone.
        </p>
        <div className="mt-4">
          <Input
            label="Confirm your password"
            type="password"
            name="delete_password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            error={error}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-pill border border-gray-200 py-3 text-sm font-semibold text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving || !password}
            className="flex-1 rounded-pill bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </div>
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

  const [accountForm, setAccountForm] = useState({
    full_name: '',
    country: 'IRELAND',
    motherhood_stage: 'postpartum',
    pregnancy_week: '',
    due_date: '',
    baby_age_months: '',
    feeding_method: '',
    marital_status: '',
    number_of_children: '',
    employment_status: '',
    stage_reason: '',
  });
  const [expandedAccountField, setExpandedAccountField] = useState(null);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [showChangeStageConfirm, setShowChangeStageConfirm] = useState(false);

  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
          pregnancy_week: data.pregnancy_week ?? '',
          due_date: data.due_date || '',
          baby_age_months: data.baby_age_months ?? '',
          feeding_method: data.feeding_method || '',
          marital_status: data.marital_status || '',
          number_of_children: data.number_of_children ?? '',
          employment_status: data.employment_status || '',
          stage_reason: data.stage_reason || '',
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

  // saves just the given field(s), a PATCH so untouched fields like full_name are never at risk of being wiped out
  const saveField = async (fieldNames) => {
    setAccountError('');
    setAccountSaving(true);
    try {
      const payload = {};
      fieldNames.forEach((field) => {
        const value = accountForm[field];
        // number fields: send null rather than an empty string when cleared
        payload[field] = value === '' ? null : value;
      });
      await api.patch('/api/auth/profile/', payload);
      setProfile((prev) => ({ ...prev, ...payload }));
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
      // best effort, a denied browser permission shouldn't block saving the preference
      await requestNotificationPermission();
    }

    try {
      await api.patch('/api/auth/profile/', { notifications_enabled: next });
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

  const cancelDeleteAccount = () => {
    setShowDeleteAccountConfirm(false);
    setDeletePassword('');
    setDeleteError('');
  };

  const confirmDeleteAccount = async () => {
    setDeleteError('');
    setDeleteSaving(true);
    try {
      await api.delete('/api/auth/account/', { data: { password: deletePassword } });
      logout();
      navigate('/login');
    } catch (err) {
      setDeleteError(extractErrorMessage(err));
    } finally {
      setDeleteSaving(false);
    }
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
              <Button
                className="mt-3"
                fullWidth={false}
                disabled={accountSaving}
                onClick={() => saveField(['full_name'])}
              >
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
              <Button
                className="mt-3"
                fullWidth={false}
                disabled={accountSaving}
                onClick={() => saveField(['country'])}
              >
                {accountSaving ? 'Saving…' : 'Save'}
              </Button>
            </Row>

            <Row
              icon={<Heart variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-pink-100 text-pink-600"
              label="Change your stage"
              value={stageLabel(profile?.motherhood_stage)}
              chevron={false}
              onClick={() => setShowChangeStageConfirm(true)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Stage Details</h2>
          <div className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[12px] bg-white">
            {profile?.motherhood_stage === 'pregnant' && (
              <>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Weeks Pregnant"
                  value={numberOrAdd(accountForm.pregnancy_week)}
                  expanded={expandedAccountField === 'pregnancy_week'}
                  onClick={() => toggleAccountField('pregnancy_week')}
                >
                  <Input
                    label="Weeks pregnant"
                    type="number"
                    name="pregnancy_week"
                    value={accountForm.pregnancy_week}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, pregnancy_week: e.target.value }))}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['pregnancy_week'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Due Date"
                  value={accountForm.due_date || 'Add'}
                  expanded={expandedAccountField === 'due_date'}
                  onClick={() => toggleAccountField('due_date')}
                >
                  <Input
                    label="Due date"
                    type="date"
                    name="due_date"
                    value={accountForm.due_date}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, due_date: e.target.value }))}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['due_date'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
              </>
            )}

            {profile?.motherhood_stage === 'postpartum' && (
              <>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Baby's Age (months)"
                  value={numberOrAdd(accountForm.baby_age_months)}
                  expanded={expandedAccountField === 'baby_age_months'}
                  onClick={() => toggleAccountField('baby_age_months')}
                >
                  <Input
                    label="Baby's age (months)"
                    type="number"
                    name="baby_age_months"
                    value={accountForm.baby_age_months}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, baby_age_months: e.target.value }))}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['baby_age_months'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Feeding Method"
                  value={optionLabel(FEEDING_OPTIONS, accountForm.feeding_method)}
                  expanded={expandedAccountField === 'feeding_method'}
                  onClick={() => toggleAccountField('feeding_method')}
                >
                  <SelectField
                    label="Feeding method"
                    value={accountForm.feeding_method}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, feeding_method: e.target.value }))}
                    options={FEEDING_OPTIONS}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['feeding_method'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
              </>
            )}

            {profile?.motherhood_stage === 'seasoned' && (
              <>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Marital Status"
                  value={optionLabel(MARITAL_STATUS_OPTIONS, accountForm.marital_status)}
                  expanded={expandedAccountField === 'marital_status'}
                  onClick={() => toggleAccountField('marital_status')}
                >
                  <SelectField
                    label="Marital status"
                    value={accountForm.marital_status}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, marital_status: e.target.value }))}
                    options={MARITAL_STATUS_OPTIONS}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['marital_status'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Number of Children"
                  value={numberOrAdd(accountForm.number_of_children)}
                  expanded={expandedAccountField === 'number_of_children'}
                  onClick={() => toggleAccountField('number_of_children')}
                >
                  <Input
                    label="Number of children"
                    type="number"
                    name="number_of_children"
                    value={accountForm.number_of_children}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, number_of_children: e.target.value }))}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['number_of_children'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
                <Row
                  icon={<Heart variant="Linear" color="currentColor" size={20} />}
                  iconBg="bg-pink-100 text-pink-600"
                  label="Employment Status"
                  value={optionLabel(EMPLOYMENT_STATUS_OPTIONS, accountForm.employment_status)}
                  expanded={expandedAccountField === 'employment_status'}
                  onClick={() => toggleAccountField('employment_status')}
                >
                  <SelectField
                    label="Employment status"
                    value={accountForm.employment_status}
                    onChange={(e) => setAccountForm((prev) => ({ ...prev, employment_status: e.target.value }))}
                    options={EMPLOYMENT_STATUS_OPTIONS}
                  />
                  {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                  <Button
                    className="mt-3"
                    fullWidth={false}
                    disabled={accountSaving}
                    onClick={() => saveField(['employment_status'])}
                  >
                    {accountSaving ? 'Saving…' : 'Save'}
                  </Button>
                </Row>
              </>
            )}

            {profile?.motherhood_stage === 'exploring' && (
              <Row
                icon={<Heart variant="Linear" color="currentColor" size={20} />}
                iconBg="bg-pink-100 text-pink-600"
                label="Reason for Using Modacare"
                value={accountForm.stage_reason || 'Add'}
                expanded={expandedAccountField === 'stage_reason'}
                onClick={() => toggleAccountField('stage_reason')}
              >
                <Input
                  label="Reason for using Modacare"
                  name="stage_reason"
                  value={accountForm.stage_reason}
                  onChange={(e) => setAccountForm((prev) => ({ ...prev, stage_reason: e.target.value }))}
                />
                {accountError && <p className="mt-2 text-xs text-red-500">{accountError}</p>}
                <Button
                  className="mt-3"
                  fullWidth={false}
                  disabled={accountSaving}
                  onClick={() => saveField(['stage_reason'])}
                >
                  {accountSaving ? 'Saving…' : 'Save'}
                </Button>
              </Row>
            )}
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
          <div className="divide-y divide-red-100 overflow-hidden rounded-[12px] bg-red-50">
            <Row
              icon={<Logout variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-red-100 text-red-600"
              label="Log Out"
              labelClassName="text-red-600"
              chevron
              onClick={handleLogout}
            />
            <Row
              icon={<Trash variant="Linear" color="currentColor" size={20} />}
              iconBg="bg-red-100 text-red-600"
              label="Delete Account"
              labelClassName="text-red-600"
              chevron
              onClick={() => setShowDeleteAccountConfirm(true)}
            />
          </div>
        </section>
      </div>

      {showChangeStageConfirm && (
        <ChangeStageConfirmModal
          onCancel={() => setShowChangeStageConfirm(false)}
          onConfirm={() => navigate('/motherhood-stage')}
        />
      )}

      {showDeleteAccountConfirm && (
        <DeleteAccountConfirmModal
          password={deletePassword}
          onPasswordChange={setDeletePassword}
          onCancel={cancelDeleteAccount}
          onConfirm={confirmDeleteAccount}
          saving={deleteSaving}
          error={deleteError}
        />
      )}
    </div>
  );
}
