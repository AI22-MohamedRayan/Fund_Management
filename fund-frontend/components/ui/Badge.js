const TONES = {
  ACTIVE: "bg-ledger-teal-500/10 text-ledger-teal-600 border-ledger-teal-500/20",
  COMPLETED: "bg-ledger-navy-500/10 text-ledger-navy-700 border-ledger-navy-500/20",
  CANCELLED: "bg-ledger-slate-400/10 text-ledger-slate-600 border-ledger-slate-400/20",
  PENDING: "bg-ledger-amber-500/10 text-ledger-amber-600 border-ledger-amber-500/20",
  REVERSED: "bg-ledger-red-500/10 text-ledger-red-600 border-ledger-red-500/20",
  SUPER_ADMIN: "bg-ledger-navy-700 text-white border-ledger-navy-700",
  ADMIN: "bg-ledger-navy-500/10 text-ledger-navy-700 border-ledger-navy-500/20",
  MEMBER: "bg-ledger-slate-400/10 text-ledger-slate-600 border-ledger-slate-400/20",
};

export function Badge({ children, tone = "MEMBER" }) {
  const cls = TONES[tone] || TONES.MEMBER;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
