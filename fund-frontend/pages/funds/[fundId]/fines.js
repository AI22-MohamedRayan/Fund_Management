import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { CancelFineForm } from "@/components/forms/CancelFineForm";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as finesService from "@/services/fines";

export default function FinesPage() {
  const router = useRouter();
  const { fundId } = router.query;
  const [fines, setFines] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ACTIVE");
  const [cancelTarget, setCancelTarget] = useState(null);
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setFines(null);
    finesService
      .getAllFines(fundId)
      .then(setFines)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load fines."));
  }, [fundId]);

  useEffect(load, [load]);

  const filtered = fines ? (filter === "ALL" ? fines : fines.filter((f) => f.status === filter)) : fines;

  const columns = [
    {
      key: "member_id",
      header: "Member",
      sortable: true,
      render: (f) => getMemberDisplayName(f.member_id, memberNameMap, f.member_id),
    },
    { key: "amount", header: "Amount", sortable: true, render: (f) => formatCurrency(f.amount) },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (f) => <Badge tone={f.status}>{f.status}</Badge> },
    { key: "created_at", header: "Date", sortable: true, render: (f) => formatDate(f.created_at) },
    {
      key: "actions",
      header: "",
      render: (f) =>
        f.status === "ACTIVE" ? (
          <button
            onClick={() => setCancelTarget(f)}
            className="text-xs font-semibold text-ledger-red-600 hover:underline"
          >
            Cancel Fine
          </button>
        ) : null,
    },
  ];

  return (
    <AppShell title="Fines" requireAdmin>
      <div className="mb-4 flex gap-2">
        {["ACTIVE", "CANCELLED", "ALL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              filter === f
                ? "border-ledger-navy-700 bg-ledger-navy-700 text-white"
                : "border-ledger-border bg-white text-ledger-slate-600"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          loading={fines === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search by member"
          rowKey={(f) => f.id}
          emptyIcon={ShieldAlert}
          emptyTitle="No fines found"
          emptyDescription="Late and missed-payment fines are applied automatically by the scheduler."
        />
      </Card>

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Fine">
        {cancelTarget ? (
          <CancelFineForm
            fundId={fundId}
            fine={cancelTarget}
            onCancelled={load}
            onClose={() => setCancelTarget(null)}
          />
        ) : null}
      </Modal>
    </AppShell>
  );
}
