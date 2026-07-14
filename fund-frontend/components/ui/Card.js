export function Card({ children, className = "", padded = true }) {
  return (
    <div
      className={`bg-ledger-surface border border-ledger-border rounded-card shadow-card ${
        padded ? "p-4 sm:p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, tone = "default" }) {
  const toneClass =
    {
      default: "text-ledger-ink",
      positive: "text-ledger-teal-600",
      negative: "text-ledger-red-600",
      warning: "text-ledger-amber-600",
    }[tone] || "text-ledger-ink";

  return (
    <Card className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-ledger-slate-500">
        {label}
      </span>
      <span className={`font-mono text-2xl font-semibold tabular ${toneClass}`}>{value}</span>
      {sub ? <span className="text-xs text-ledger-slate-400">{sub}</span> : null}
    </Card>
  );
}
