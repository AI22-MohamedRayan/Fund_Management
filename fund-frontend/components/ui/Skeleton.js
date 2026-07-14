export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-ledger-border/70 ${className}`} />;
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-card border border-ledger-border bg-white p-5">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="h-7 w-32" />
    </div>
  );
}
