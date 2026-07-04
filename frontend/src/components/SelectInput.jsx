// Reusable labelled dropdown.
export default function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = '-- Select --',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="w-32 shrink-0 text-sm text-gray-700">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-400 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
