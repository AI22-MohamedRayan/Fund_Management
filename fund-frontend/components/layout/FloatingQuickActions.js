import { useState } from "react";
import { useRouter } from "next/router";
import { Plus, X, Wallet, Landmark, UserPlus, Receipt } from "lucide-react";
import { useFund } from "@/contexts/FundContext";

export function FloatingQuickActions({ onAction }) {
  const [open, setOpen] = useState(false);
  const { isAdmin, isSuperAdmin } = useFund();
  const router = useRouter();

  if (!isAdmin) return null;

  const actions = [
    { key: "payment", label: "Record Payment", icon: Wallet },
    { key: "loan", label: "Give Loan", icon: Landmark },
    isSuperAdmin ? { key: "member", label: "Add Member", icon: UserPlus } : null,
    { key: "expense", label: "Add Expense", icon: Receipt },
  ].filter(Boolean);

  const handle = (key) => {
    setOpen(false);
    if (onAction) {
      onAction(key);
      return;
    }
    router.push(`/funds/${router.query.fundId}/${key}s?new=1`);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      {open ? (
        <div className="flex flex-col items-end gap-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.key}
                onClick={() => handle(a.key)}
                className="flex items-center gap-2.5 rounded-full bg-white py-2.5 pl-4 pr-3 text-sm font-medium text-ledger-ink shadow-raised border border-ledger-border"
              >
                {a.label}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ledger-navy-700 text-white">
                  <Icon className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close quick actions" : "Open quick actions"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ledger-navy-700 text-white shadow-raised transition-transform hover:bg-ledger-navy-900 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>
    </div>
  );
}
