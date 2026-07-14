import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, UserRound, Landmark, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/Table";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RecordPaymentForm } from "@/components/forms/RecordPaymentForm";
import { CreateLoanForm } from "@/components/forms/CreateLoanForm";
import { formatCurrency, formatDate, initials } from "@/lib/formatters";
import { ROLE_LABELS } from "@/lib/constants";
import { ApiError } from "@/lib/api";
import { useFund } from "@/contexts/FundContext";
import * as loansService from "@/services/loans";
import * as paymentsService from "@/services/payments";
import * as finesService from "@/services/fines";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";

export default function MemberProfilePage() {
  const router = useRouter();
  const { fundId, memberId } = router.query;
  const { members, isSuperAdmin } = useFund();
  const [loans, setLoans] = useState(null);
  const [payments, setPayments] = useState(null);
  const [fines, setFines] = useState(null);
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);

  const memberRecord = members?.find((m) => m.user_id === memberId);
  const { memberNameMap, loading: namesLoading } = useMemberNameMap(fundId);
  const displayName = getMemberDisplayName(memberId, memberNameMap, null);

  const load = useCallback(() => {
    if (!fundId || !memberId) return;
    setError("");
    Promise.all([
      loansService.getMemberLoans(fundId, memberId),
      paymentsService.getMemberPayments(fundId, memberId),
      finesService.getMemberFines(fundId, memberId),
    ])
      .then(([l, p, f]) => {
        setLoans(l);
        setPayments(p);
        setFines(f);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load member data."));
  }, [fundId, memberId]);

  useEffect(load, [load]);

  const activeLoan = loans?.find((l) => l.status === "ACTIVE");

  return (
    <AppShell title="Member Profile" requireAdmin>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ledger-slate-500 hover:text-ledger-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {(!displayName && namesLoading) ? (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full animate-pulse bg-ledger-border" />
              <div>
                <div className="h-6 w-40 rounded-md animate-pulse bg-ledger-border" />
                <div className="mt-2 h-4 w-32 rounded-md animate-pulse bg-ledger-border" />
              </div>
            </div>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ledger-navy-700 text-sm font-semibold text-white">
                {initials(displayName || memberId)}
              </span>
              <div>
                <p className="font-display text-base font-semibold text-ledger-ink">{displayName || memberId}</p>
                {memberRecord ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={memberRecord.role}>{ROLE_LABELS[memberRecord.role]}</Badge>
                    <Badge tone={memberRecord.contribution_paid ? "ACTIVE" : "PENDING"}>
                      {memberRecord.contribution_paid ? "Contribution Paid" : "Contribution Pending"}
                    </Badge>
                  </div>
                ) : !isSuperAdmin ? (
                  <p className="mt-1 text-xs text-ledger-slate-400">
                    Role and contribution status are only visible to the Super Admin.
                  </p>
                ) : null}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {!activeLoan ? (
            <Button variant="secondary" onClick={() => setAction("loan")}>
              <Landmark className="h-4 w-4" />
              Give Loan
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setAction("payment")}>
              <Wallet className="h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>
      </Card>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !loans ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 font-display text-sm font-semibold text-ledger-ink">Loans</h2>
            <Card padded={false}>
              <DataTable
                searchable={false}
                pageSize={10}
                rowKey={(l) => l.id}
                data={loans}
                columns={[
                  { key: "principal_amount", header: "Original", render: (l) => formatCurrency(l.principal_amount) },
                  { key: "outstanding_amount", header: "Outstanding", render: (l) => formatCurrency(l.outstanding_amount) },
                  { key: "next_due_date", header: "Next Due", render: (l) => formatDate(l.next_due_date) },
                  { key: "status", header: "Status", render: (l) => <Badge tone={l.status}>{l.status}</Badge> },
                  {
                    key: "actions",
                    header: "",
                    render: (l) => (
                      <button
                        onClick={() => router.push(`/funds/${fundId}/loans/${l.id}`)}
                        className="text-xs font-semibold text-ledger-navy-700 hover:underline"
                      >
                        View
                      </button>
                    ),
                  },
                ]}
                emptyTitle="No loans"
                emptyDescription="This member has not taken a loan yet."
                icon={UserRound}
              />
            </Card>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold text-ledger-ink">Payments</h2>
            <Card padded={false}>
              <DataTable
                searchable={false}
                pageSize={10}
                rowKey={(p) => p.id}
                data={payments}
                columns={[
                  { key: "amount", header: "Amount", render: (p) => formatCurrency(p.amount) },
                  { key: "payment_date", header: "Date", render: (p) => formatDate(p.payment_date) },
                ]}
                emptyTitle="No payments"
                emptyDescription="This member has not made a repayment yet."
              />
            </Card>
          </section>

          <section>
            <h2 className="mb-2 font-display text-sm font-semibold text-ledger-ink">Fines</h2>
            <Card padded={false}>
              <DataTable
                searchable={false}
                pageSize={10}
                rowKey={(f) => f.id}
                data={fines}
                columns={[
                  { key: "amount", header: "Amount", render: (f) => formatCurrency(f.amount) },
                  { key: "reason", header: "Reason" },
                  { key: "status", header: "Status", render: (f) => <Badge tone={f.status}>{f.status}</Badge> },
                ]}
                emptyTitle="No fines"
                emptyDescription="This member has no fines on record."
              />
            </Card>
          </section>
        </div>
      )}

      <Modal open={action === "payment"} onClose={() => setAction(null)} title="Record Payment">
        <RecordPaymentForm fundId={fundId} onRecorded={() => { setAction(null); load(); }} />
      </Modal>
      <Modal open={action === "loan"} onClose={() => setAction(null)} title="Give Loan">
        <CreateLoanForm fundId={fundId} onCreated={() => { setAction(null); load(); }} />
      </Modal>
    </AppShell>
  );
}
