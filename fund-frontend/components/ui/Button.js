import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-ledger-navy-700 text-white hover:bg-ledger-navy-900 disabled:bg-ledger-navy-300",
  secondary:
    "bg-white text-ledger-navy-700 border border-ledger-border hover:bg-ledger-bg disabled:text-ledger-slate-400",
  danger:
    "bg-ledger-red-500 text-white hover:bg-ledger-red-600 disabled:bg-ledger-red-500/50",
  ghost:
    "bg-transparent text-ledger-slate-600 hover:bg-ledger-bg disabled:text-ledger-slate-400",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors min-h-[44px] disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
