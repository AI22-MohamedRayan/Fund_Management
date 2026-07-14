import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/Table";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as loansService from "@/services/loans";
import * as paymentsService from "@/services/payments";
import * as finesService from "@/services/fines";

export default function LoanDetailPage() {
  const router = useRouter();
  const { fundId, loanId } = router.query;
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState(null);
  const [fines, setFines] = useState(null);
  const [error, setError] = useState("");
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId || !loanId) return;
    setError("");
    Promise.all([
      loansService.getLoan(fundId, loanId),
      paymentsService.getLoanPayments(fundId, loanId),
      finesService.getLoanFines(fundId, loanId),
    ])
      .then(([l, p, f]) => {
        setLoan(l);
        setPayments(p);
        setFines(f);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load loan details."));
  }, [fundId, loanId]);

  useEffect(load, [load]);

  const paymentColumns = [
    { key: "amount", header: "Amount", render: (p) => formatCurrency(p.amount) },
    { key: "payment_date", header: "Date", render: (p) => formatDate(p.payment_date) },
  ];

  const fineColumns = [
    { key: "amount", header: "Amount", render: (f) => formatCurrency(f.amount) },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (f) => <Badge tone={f.status}>{f.status}</Badge> },
    { key: "created_at", header: "Date", render: (f) => formatDate(f.created_at) },
  ];

  return (
    <AppShell title="Loan Details" requireAdmin>
      <button
        onClick={() => router.push(`/funds/${fundId}/loans`)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ledger-slate-500 hover:text-ledger-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Loans
      </button>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !loan ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-base font-semibold text-ledger-ink">
                {getMemberDisplayName(loan.member_id, memberNameMap, loan.member_id)}
              </p>
              <Badge tone={loan.status}>{loan.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Detail label="Original Amount" value={formatCurrency(loan.principal_amount)} />
              <Detail label="Interest" value={formatCurrency(loan.interest)} />
              <Detail label="Disbursed" value={formatCurrency(loan.disbursed_amount)} />
              <Detail label="Outstanding" value={formatCurrency(loan.outstanding_amount)} tone="warning" />
              <Detail label="Weekly Minimum" value={formatCurrency(loan.weekly_minimum)} />
              <Detail label="Loan Date" value={formatDate(loan.loan_date)} />
              <Detail label="First Due Date" value={formatDate(loan.first_due_date)} />
              <Detail label="Next Due Date" value={formatDate(loan.next_due_date)} />
            </div>
          </Card>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold text-ledger-ink">Payments</h2>
            <Card padded={false}>
              <DataTable
                columns={paymentColumns}
                data={payments}
                loading={false}
                searchable={false}
                pageSize={20}
                rowKey={(p) => p.id}
                emptyTitle="No payments yet"
                emptyDescription="Repayments recorded against this loan will appear here."
              />
            </Card>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold text-ledger-ink">Fines</h2>
            <Card padded={false}>
              <DataTable
                columns={fineColumns}
                data={fines}
                loading={false}
                searchable={false}
                pageSize={20}
                rowKey={(f) => f.id}
                emptyTitle="No fines"
                emptyDescription="Late or missed-payment fines for this loan will appear here."
              />
            </Card>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Detail({ label, value, tone = "default" }) {
  const toneClass = tone === "warning" ? "text-ledger-amber-600" : "text-ledger-ink";
  return (
    <div>
      <p className="text-xs text-ledger-slate-500">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold tabular ${toneClass}`}>{value}</p>
    </div>
  );
}
