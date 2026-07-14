import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Landmark, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { CreateLoanForm } from "@/components/forms/CreateLoanForm";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as loansService from "@/services/loans";

export default function LoansPage() {
  const router = useRouter();
  const { fundId, new: newParam } = router.query;
  const [loans, setLoans] = useState(null);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setLoans(null);
    loansService
      .getAllLoans(fundId)
      .then(setLoans)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load loans."));
  }, [fundId]);

  useEffect(load, [load]);
  useEffect(() => {
    if (newParam === "1") setCreateOpen(true);
  }, [newParam]);

  const filtered = loans ? (filter === "ALL" ? loans : loans.filter((l) => l.status === filter)) : loans;

  const columns = [
    {
      key: "member_id",
      header: "Member",
      sortable: true,
      render: (l) => getMemberDisplayName(l.member_id, memberNameMap, l.member_id),
    },
    {
      key: "principal_amount",
      header: "Original Amount",
      sortable: true,
      render: (l) => formatCurrency(l.principal_amount),
    },
    {
      key: "outstanding_amount",
      header: "Outstanding",
      sortable: true,
      render: (l) => formatCurrency(l.outstanding_amount),
    },
    { key: "next_due_date", header: "Next Due", sortable: true, render: (l) => formatDate(l.next_due_date) },
    {
      key: "status",
      header: "Status",
      render: (l) => <Badge tone={l.status}>{l.status}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (l) => (
        <button
          onClick={() => router.push(`/funds/${fundId}/loans/${l.id}`)}
          className="text-xs font-semibold text-ledger-navy-700 hover:underline"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <AppShell title="Loans" requireAdmin>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["ALL", "ACTIVE", "COMPLETED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                filter === f
                  ? "border-ledger-navy-700 bg-ledger-navy-700 text-white"
                  : "border-ledger-border bg-white text-ledger-slate-600"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Give Loan
        </Button>
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={filtered}
          loading={loans === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search by member"
          rowKey={(l) => l.id}
          emptyIcon={Landmark}
          emptyTitle="No loans found"
          emptyDescription="Loans given to members will appear here."
        />
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Give Loan">
        <CreateLoanForm fundId={fundId} onCreated={() => { setCreateOpen(false); load(); }} />
      </Modal>
    </AppShell>
  );
}
