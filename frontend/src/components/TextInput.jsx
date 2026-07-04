// Reusable labelled text input used across the Sales Order form.
export default function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="w-32 shrink-0 text-sm text-gray-700">{label}</label>
      )}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full rounded border border-gray-400 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 ${
          readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white'
        }`}
      />
    </div>
  );
}
