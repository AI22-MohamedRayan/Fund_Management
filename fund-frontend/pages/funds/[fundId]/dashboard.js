import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Wallet,
  Users,
  Landmark,
  TrendingUp,
  ShieldAlert,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FloatingQuickActions } from "@/components/layout/FloatingQuickActions";
import { StatCard } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { RecordPaymentForm } from "@/components/forms/RecordPaymentForm";
import { CreateLoanForm } from "@/components/forms/CreateLoanForm";
import { AddMemberForm } from "@/components/forms/AddMemberForm";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import * as dashboardService from "@/services/dashboard";
import { formatCurrency } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { useFund } from "@/contexts/FundContext";

export default function DashboardPage() {
  const router = useRouter();
  const { fundId } = router.query;
  const { fund, isSuperAdmin } = useFund();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeAction, setActiveAction] = useState(null);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setData(null);
    dashboardService
      .getDashboard(fundId)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load the dashboard."));
  }, [fundId]);

  useEffect(load, [load]);

  return (
    <AppShell title="Dashboard" requireAdmin>
      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <StatCard
              label="Current Balance"
              value={formatCurrency(data.current_balance)}
              tone={data.current_balance >= 0 ? "positive" : "negative"}
            />
            <StatCard label="Members" value={data.members} />
            <StatCard label="Active Loans" value={data.active_loans} />
            <StatCard label="Outstanding" value={formatCurrency(data.outstanding_amount)} tone="warning" />
            <StatCard label="Interest Earned" value={formatCurrency(data.interest_earned)} tone="positive" />
            <StatCard label="Fine Collected" value={formatCurrency(data.fine_collected)} />
            <StatCard label="Expenses" value={formatCurrency(data.expenses)} tone="negative" />
          </div>

          <div className="mt-8 hidden gap-3 lg:flex">
            <QuickActionButton
              icon={Wallet}
              label="Record Payment"
              onClick={() => setActiveAction("payment")}
            />
            <QuickActionButton icon={Landmark} label="Give Loan" onClick={() => setActiveAction("loan")} />
            {isSuperAdmin ? (
              <QuickActionButton icon={Users} label="Add Member" onClick={() => setActiveAction("member")} />
            ) : null}
            <QuickActionButton icon={Receipt} label="Add Expense" onClick={() => setActiveAction("expense")} />
          </div>
        </>
      )}

      <FloatingQuickActions onAction={setActiveAction} />

      <Modal open={activeAction === "payment"} onClose={() => setActiveAction(null)} title="Record Payment">
        <RecordPaymentForm fundId={fundId} onRecorded={() => { setActiveAction(null); load(); }} />
      </Modal>
      <Modal open={activeAction === "loan"} onClose={() => setActiveAction(null)} title="Give Loan">
        <CreateLoanForm fundId={fundId} onCreated={() => { setActiveAction(null); load(); }} />
      </Modal>
      <Modal open={activeAction === "member"} onClose={() => setActiveAction(null)} title="Add Member">
        <AddMemberForm fundId={fundId} onAdded={() => { setActiveAction(null); load(); }} />
      </Modal>
      <Modal open={activeAction === "expense"} onClose={() => setActiveAction(null)} title="Add Expense">
        <AddExpenseForm fundId={fundId} onAdded={() => { setActiveAction(null); load(); }} />
      </Modal>
    </AppShell>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg border border-ledger-border bg-white px-4 py-2.5 text-sm font-medium text-ledger-ink shadow-card hover:bg-ledger-bg"
    >
      <Icon className="h-4 w-4 text-ledger-navy-700" />
      {label}
    </button>
  );
}
