import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Select, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as paymentsService from "@/services/payments";
import * as loansService from "@/services/loans";

export function RecordPaymentForm({ fundId, onRecorded }) {
  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { memberNameMap } = useMemberNameMap(fundId);

  useEffect(() => {
    loansService
      .getActiveLoans(fundId)
      .then(setLoans)
      .catch(() => setError("Could not load active loans."))
      .finally(() => setLoadingLoans(false));
  }, [fundId]);

  const selectedLoan = loans.find((l) => l.id === loanId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loanId || !amount || Number(amount) <= 0) {
      setError("Select a loan and enter a valid payment amount.");
      return;
    }
    setError("");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payment = await paymentsService.recordPayment(fundId, {
        loan_id: loanId,
        amount: Number(amount),
      });
      toast.success("Payment recorded successfully.");
      setConfirmOpen(false);
      setAmount("");
      onRecorded?.(payment);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not record the payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Active Loan"
          name="loan_id"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          disabled={loadingLoans}
        >
          <option value="">{loadingLoans ? "Loading loans..." : "Select a loan"}</option>
          {loans.map((l) => (
            <option key={l.id} value={l.id}>
              {getMemberDisplayName(l.member_id, memberNameMap, l.member_id)} — Outstanding {formatCurrency(l.outstanding_amount)}
            </option>
          ))}
        </Select>

        {selectedLoan ? (
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-ledger-border bg-ledger-bg p-3 text-sm">
            <Info label="Outstanding" value={formatCurrency(selectedLoan.outstanding_amount)} />
            <Info label="Next Due" value={formatDate(selectedLoan.next_due_date)} />
          </div>
        ) : null}

        <Input
          label="Payment Amount"
          name="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          hint="The server enforces the weekly minimum and rejects amounts above the outstanding balance."
        />

        {error ? <p className="text-xs text-ledger-red-600">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loadingLoans}>
          Continue
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        title="Confirm payment"
        description="This records a repayment against the selected loan and moves the repayment cycle forward."
        confirmLabel="Record Payment"
        details={[
          { label: "Member", value: getMemberDisplayName(selectedLoan?.member_id, memberNameMap, selectedLoan?.member_id) },
          { label: "Amount", value: formatCurrency(Number(amount || 0)) },
        ]}
      />
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ledger-slate-500">{label}</p>
      <p className="font-mono font-semibold text-ledger-ink tabular">{value}</p>
    </div>
  );
}
