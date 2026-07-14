import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-red-500/10">
        <AlertTriangle className="h-6 w-6 text-ledger-red-500" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ledger-ink">Something went wrong</p>
        <p className="max-w-xs text-sm text-ledger-slate-500">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
