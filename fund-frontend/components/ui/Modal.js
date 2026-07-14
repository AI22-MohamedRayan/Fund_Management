import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" }[size] || "max-w-md";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ledger-ink/50 backdrop-blur-[1px] sm:items-center sm:p-4">
      <div
        className={`flex max-h-[90vh] w-full ${widthClass} flex-col rounded-t-2xl bg-white shadow-raised sm:rounded-card`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-ledger-border px-5 py-4">
          <h2 className="text-base font-display font-semibold text-ledger-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ledger-slate-500 hover:bg-ledger-bg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-ledger-border px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
