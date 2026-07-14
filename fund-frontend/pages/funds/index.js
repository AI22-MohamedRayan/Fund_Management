import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Landmark, Plus, LogOut, Wallet, CircleCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { CreateFundForm } from "@/components/forms/CreateFundForm";
import { useAuth } from "@/contexts/AuthContext";
import { useFund } from "@/contexts/FundContext";
import * as fundsService from "@/services/funds";
import * as ledgerService from "@/services/ledger";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";

export default function FundsPage() {
  const router = useRouter();
  const { user, ready, isAuthenticated, logout } = useAuth();
  const { selectFund } = useFund();
  const [funds, setFunds] = useState(null);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [entering, setEntering] = useState(null);
  // Per fund: { loading, found, outstanding, totalPaid, nextDue }
  const [myLoans, setMyLoans] = useState({});

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isAuthenticated]);

  const load = () => {
    setError("");
    setFunds(null);
    fundsService
      .getFunds()
      .then((list) => {
        setFunds(list);
        loadMyLoanSummaries(list);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load funds."));
  };

  // Every member's paid/outstanding/next-due standing is already exposed by
  // the public ledger endpoint (no admin rights required), so we pull each
  // fund's ledger and pick out the row matching the logged-in user's phone
  // number rather than needing a dedicated "my loans" endpoint.
  const loadMyLoanSummaries = (fundList) => {
    if (!user?.phone) return;
    fundList.forEach((f) => {
      setMyLoans((prev) => ({ ...prev, [f.id]: { loading: true } }));
      ledgerService
        .getPublicLedger(f.id)
        .then((rows) => {
          const mine = rows.find((r) => r.phone_number === user.phone);
          setMyLoans((prev) => ({
            ...prev,
            [f.id]: mine
              ? {
                  loading: false,
                  found: true,
                  hasLoan: mine.original_loan_amount > 0,
                  outstanding: mine.outstanding_amount,
                  totalPaid: mine.total_paid,
                  nextDue: mine.next_due_date,
                }
              : { loading: false, found: false },
          }));
        })
        .catch(() => setMyLoans((prev) => ({ ...prev, [f.id]: { loading: false, found: false } })));
    });
  };

  const handleEnter = async (fundId) => {
    setEntering(fundId);
    try {
      await selectFund(fundId);
      router.push(`/funds/${fundId}/dashboard`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not open this fund.");
      setEntering(null);
    }
  };

  return (
    <div className="min-h-screen bg-ledger-bg">
      <header className="border-b border-ledger-border bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ledger-navy-700 text-white">
              <Landmark className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold text-ledger-ink">
              Fund Management
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-ledger-slate-500 hover:text-ledger-ink"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-ledger-ink">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-ledger-slate-500">Select a fund to continue</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            New Fund
          </Button>
        </div>

        {funds === null && !error ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : funds.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No funds yet"
            description="Create your first fund to start tracking contributions, loans and repayments."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Fund
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {funds.map((f) => (
              <Card key={f.id} className="flex flex-col gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-ledger-ink">{f.fund_name}</p>
                  <p className="mt-1 text-xs text-ledger-slate-500">
                    Contribution {formatCurrency(f.contribution_amount)} &middot; Opening balance{" "}
                    {formatCurrency(f.opening_balance)}
                  </p>
                </div>

                <MyLoanSummary summary={myLoans[f.id]} />

                <Button
                  variant="secondary"
                  onClick={() => handleEnter(f.id)}
                  loading={entering === f.id}
                  className="w-full"
                >
                  Open Fund
                </Button>
              </Card>
            ))}
          </div>
        )}

        <Button onClick={() => setCreateOpen(true)} className="mt-6 w-full sm:hidden">
          <Plus className="h-4 w-4" />
          New Fund
        </Button>
      </main>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a New Fund">
        <CreateFundForm
          onCreated={(fund) => {
            setCreateOpen(false);
            load();
            handleEnter(fund.id);
          }}
        />
      </Modal>
    </div>
  );
}

function MyLoanSummary({ summary }) {
  if (!summary || summary.loading) {
    return <Skeleton className="h-14 w-full" />;
  }

  if (!summary.found || !summary.hasLoan) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-ledger-border bg-ledger-bg px-3 py-2.5 text-xs text-ledger-slate-500">
        <CircleCheck className="h-3.5 w-3.5 shrink-0" />
        No active loan in this fund.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-ledger-border bg-ledger-bg p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ledger-slate-500">
        <Wallet className="h-3.5 w-3.5" />
        Your Loan
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-[11px] text-ledger-slate-500">Paid</p>
          <p className="font-mono font-semibold tabular text-ledger-teal-600">
            {formatCurrency(summary.totalPaid)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ledger-slate-500">Outstanding</p>
          <p className="font-mono font-semibold tabular text-ledger-amber-600">
            {formatCurrency(summary.outstanding)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ledger-slate-500">Next Due</p>
          <p className="font-mono font-semibold tabular text-ledger-ink">
            {formatDate(summary.nextDue)}
          </p>
        </div>
      </div>
    </div>
  );
}
