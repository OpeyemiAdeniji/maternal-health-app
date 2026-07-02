export default function Checkbox({ label, checked, onChange, name }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 accent-primary-600 focus:ring-2 focus:ring-primary-200"
      />
      {label}
    </label>
  );
}
