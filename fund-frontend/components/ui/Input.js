export function Input({ label, error, hint, className = "", id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      {label ? <span className="font-medium text-ledger-ink">{label}</span> : null}
      <input
        id={inputId}
        className={`min-h-[44px] rounded-lg border px-3.5 py-2.5 text-sm text-ledger-ink placeholder:text-ledger-slate-400 focus:border-ledger-navy-500 focus:ring-1 focus:ring-ledger-navy-500 ${
          error ? "border-ledger-red-500" : "border-ledger-border"
        } ${className}`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-ledger-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ledger-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function Select({ label, error, hint, className = "", id, children, ...rest }) {
  const selectId = id || rest.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={selectId}>
      {label ? <span className="font-medium text-ledger-ink">{label}</span> : null}
      <select
        id={selectId}
        className={`min-h-[44px] rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ledger-ink focus:border-ledger-navy-500 focus:ring-1 focus:ring-ledger-navy-500 ${
          error ? "border-ledger-red-500" : "border-ledger-border"
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <span className="text-xs text-ledger-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ledger-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function Textarea({ label, error, hint, className = "", id, ...rest }) {
  const areaId = id || rest.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={areaId}>
      {label ? <span className="font-medium text-ledger-ink">{label}</span> : null}
      <textarea
        id={areaId}
        className={`rounded-lg border px-3.5 py-2.5 text-sm text-ledger-ink placeholder:text-ledger-slate-400 focus:border-ledger-navy-500 focus:ring-1 focus:ring-ledger-navy-500 ${
          error ? "border-ledger-red-500" : "border-ledger-border"
        } ${className}`}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-ledger-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-ledger-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}
