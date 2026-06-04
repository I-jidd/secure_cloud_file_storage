function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  className = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={[
          "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-slate-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10",
        ].join(" ")}
        {...props}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export default Input;
