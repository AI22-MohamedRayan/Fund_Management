import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ApiError } from "@/lib/api";
import { ALLOWED_LOAN_AMOUNTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as loansService from "@/services/loans";
import * as membersService from "@/services/members";

export function CreateLoanForm({ fundId, onCreated }) {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { memberNameMap } = useMemberNameMap(fundId);

  useEffect(() => {
    membersService
      .getMembers(fundId)
      .then(setMembers)
      .catch(() => setError("Could not load the member list. You may not have permission to view it."))
      .finally(() => setLoadingMembers(false));
  }, [fundId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !amount) {
      setError("Select a member and a loan amount.");
      return;
    }
    setError("");
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const loan = await loansService.createLoan(fundId, {
        member_id: memberId,
        loan_amount: Number(amount),
      });
      toast.success("Loan created successfully.");
      setConfirmOpen(false);
      onCreated?.(loan);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create the loan.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m.user_id === memberId);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Member"
          name="member_id"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          disabled={loadingMembers}
        >
          <option value="">{loadingMembers ? "Loading members..." : "Select a member"}</option>
          {members.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {getMemberDisplayName(m.user_id, memberNameMap, m.user_id)}
            </option>
          ))}
        </Select>

        <Select label="Loan Amount" name="loan_amount" value={amount} onChange={(e) => setAmount(e.target.value)}>
          <option value="">Select amount</option>
          {ALLOWED_LOAN_AMOUNTS.map((a) => (
            <option key={a} value={a}>
              {formatCurrency(a)}
            </option>
          ))}
        </Select>

        {error ? <p className="text-xs text-ledger-red-600">{error}</p> : null}
        <p className="text-xs text-ledger-slate-500">
          Interest, disbursed amount, weekly minimum and the repayment schedule are calculated by
          the server after submission.
        </p>

        <Button type="submit" className="w-full" disabled={loadingMembers}>
          Continue
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        title="Confirm loan disbursement"
        description="This disburses funds to the member and creates an active loan with an automatic repayment schedule."
        confirmLabel="Give Loan"
        details={[
          {
            label: "Member",
            value: getMemberDisplayName(selectedMember?.user_id || memberId, memberNameMap, selectedMember?.user_id || memberId),
          },
          { label: "Loan Amount", value: formatCurrency(Number(amount || 0)) },
        ]}
      />
    </>
  );
}
