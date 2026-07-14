import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Wallet, Plus, Pencil } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RecordPaymentForm } from "@/components/forms/RecordPaymentForm";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as paymentsService from "@/services/payments";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const router = useRouter();
  const { fundId, new: newParam } = router.query;
  const [payments, setPayments] = useState(null);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setPayments(null);
    paymentsService
      .getAllPayments(fundId)
      .then(setPayments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load payments."));
  }, [fundId]);

  useEffect(load, [load]);
  useEffect(() => {
    if (newParam === "1") setCreateOpen(true);
  }, [newParam]);

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await paymentsService.updatePayment(fundId, editTarget.id, Number(editAmount));
      toast.success("Payment updated.");
      setConfirmEdit(false);
      setEditTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update payment.");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "member_id",
      header: "Member",
      sortable: true,
      render: (p) => getMemberDisplayName(p.member_id, memberNameMap, p.member_id),
    },
    { key: "amount", header: "Amount", sortable: true, render: (p) => formatCurrency(p.amount) },
    { key: "payment_date", header: "Date", sortable: true, render: (p) => formatDate(p.payment_date) },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <button
          onClick={() => {
            setEditTarget(p);
            setEditAmount(String(p.amount));
          }}
          className="flex items-center gap-1 text-xs font-semibold text-ledger-navy-700 hover:underline"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      ),
    },
  ];

  return (
    <AppShell title="Payments" requireAdmin>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={payments}
          loading={payments === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search by member"
          rowKey={(p) => p.id}
          emptyIcon={Wallet}
          emptyTitle="No payments recorded"
          emptyDescription="Repayments recorded against loans will appear here."
        />
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Record Payment">
        <RecordPaymentForm fundId={fundId} onRecorded={() => { setCreateOpen(false); load(); }} />
      </Modal>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Payment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => setConfirmEdit(true)}>Save Changes</Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ledger-slate-500">
          Note: only Admins may edit a payment they themselves recorded — the backend rejects edits
          to payments created by another Admin.
        </p>
        <Input
          label="Amount"
          type="number"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
        />
      </Modal>

      <ConfirmDialog
        open={confirmEdit}
        onClose={() => setConfirmEdit(false)}
        onConfirm={handleEditSave}
        loading={saving}
        title="Confirm payment update"
        description="This changes the recorded payment amount and adjusts the loan balance accordingly."
        confirmLabel="Save Changes"
        details={editTarget ? [{ label: "New Amount", value: formatCurrency(Number(editAmount || 0)) }] : null}
      />
    </AppShell>
  );
}
