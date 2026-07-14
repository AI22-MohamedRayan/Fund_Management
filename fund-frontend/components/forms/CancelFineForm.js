import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import * as finesService from "@/services/fines";

export function CancelFineForm({ fundId, fine, onCancelled, onClose }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reason.trim().length < 3) {
      setError("Reason must be at least 3 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const updated = await finesService.cancelFine(fundId, fine.id, reason.trim());
      toast.success("Fine cancelled.");
      onCancelled?.(updated);
      onClose?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not cancel the fine.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-ledger-slate-600">
        Cancelling reduces the outstanding loan amount by the fine amount. The fine record is kept,
        marked as cancelled.
      </p>
      <Textarea
        label="Reason for cancellation"
        name="reason"
        rows={3}
        placeholder="e.g. Payment was received before the due date, fine applied in error."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={error}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
          Back
        </Button>
        <Button variant="danger" type="submit" loading={submitting}>
          Cancel Fine
        </Button>
      </div>
    </form>
  );
}
