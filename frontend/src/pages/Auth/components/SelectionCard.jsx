// single-select option row, used for the stage picker and every follow-up questionnaire screen
export default function SelectionCard({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left transition-colors ${
        selected ? 'border-brand shadow-[0_8px_20px_-8px_rgba(176,15,168,0.35)]' : 'border-[#eaeaea]'
      }`}
    >
      {icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          {icon}
        </span>
      )}
      <span className="flex-1 text-sm font-semibold text-text-primary">{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-brand' : 'border-[#e2e8f0]'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
    </button>
  );
}
