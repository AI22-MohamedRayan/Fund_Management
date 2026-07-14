export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-navy-50">
          <Icon className="h-6 w-6 text-ledger-navy-500" />
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ledger-ink">{title}</p>
        {description ? (
          <p className="max-w-xs text-sm text-ledger-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
