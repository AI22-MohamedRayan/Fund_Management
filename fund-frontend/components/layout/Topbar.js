import { useFund } from "@/contexts/FundContext";

export function Topbar({ title }) {
  const { fund, role } = useFund();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ledger-border bg-white/95 px-4 py-3.5 backdrop-blur lg:hidden">
      <div className="min-w-0">
        <p className="truncate font-display text-base font-semibold text-ledger-ink">
          {title || fund?.fund_name}
        </p>
        {fund ? <p className="text-xs text-ledger-slate-500">{fund.fund_name}</p> : null}
      </div>
      {role ? (
        <span className="shrink-0 rounded-full bg-ledger-navy-50 px-2.5 py-1 text-xs font-semibold text-ledger-navy-700">
          {role.replace("_", " ")}
        </span>
      ) : null}
    </header>
  );
}
