import { Modal } from "./Modal";
import { Button } from "./Button";

/**
 * Standard confirmation gate for every financial mutation (create loan,
 * record payment, cancel fine, add expense, create fund, add member).
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description,
  details,
  confirmLabel = "Confirm",
  variant = "primary",
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {description ? <p className="text-sm text-ledger-slate-600">{description}</p> : null}
        {details ? (
          <div className="space-y-2 rounded-lg border border-ledger-border bg-ledger-bg p-3">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-sm">
                <span className="text-ledger-slate-500">{d.label}</span>
                <span className="font-mono font-semibold text-ledger-ink tabular">{d.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
