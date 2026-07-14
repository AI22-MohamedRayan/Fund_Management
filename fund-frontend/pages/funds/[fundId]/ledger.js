import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import * as ledgerService from "@/services/ledger";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";

const columns = [
  { key: "member_name", header: "Member", sortable: true },
  { key: "phone_number", header: "Phone" },
  {
    key: "next_due_date",
    header: "Next Due",
    sortable: true,
    render: (r) => formatDate(r.next_due_date),
  },
  {
    key: "original_loan_amount",
    header: "Original Loan",
    sortable: true,
    render: (r) => formatCurrency(r.original_loan_amount),
  },
  {
    key: "outstanding_amount",
    header: "Outstanding",
    sortable: true,
    render: (r) => (
      <span className={r.outstanding_amount > 0 ? "text-ledger-amber-600 font-semibold" : ""}>
        {formatCurrency(r.outstanding_amount)}
      </span>
    ),
  },
  {
    key: "total_fine",
    header: "Active Fines",
    render: (r) =>
      r.total_fine > 0 ? (
        <Badge tone="PENDING">{formatCurrency(r.total_fine)}</Badge>
      ) : (
        formatCurrency(0)
      ),
  },
  { key: "total_paid", header: "Total Paid", render: (r) => formatCurrency(r.total_paid) },
  {
    key: "last_payment_amount",
    header: "Last Payment",
    render: (r) => formatCurrency(r.last_payment_amount),
  },
  { key: "last_payment_date", header: "Last Payment Date", render: (r) => formatDate(r.last_payment_date) },
];

export default function LedgerPage() {
  const router = useRouter();
  const { fundId } = router.query;
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setRows(null);
    ledgerService
      .getPublicLedger(fundId)
      .then(setRows)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load the ledger."));
  }, [fundId]);

  useEffect(load, [load]);

  return (
    <AppShell title="Public Ledger">
      <p className="mb-4 text-sm text-ledger-slate-500">
        Read-only view of every member&apos;s standing in this fund. Visible to all members.
      </p>
      <Card padded={false}>
        <DataTable
          columns={columns}
          data={rows}
          loading={rows === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search by name or phone"
          rowKey={(r) => r.phone_number}
          emptyIcon={BookOpen}
          emptyTitle="Ledger is empty"
          emptyDescription="Once members are added, their standing will appear here."
        />
      </Card>
    </AppShell>
  );
}
