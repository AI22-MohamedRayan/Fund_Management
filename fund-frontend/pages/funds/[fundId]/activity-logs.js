import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { ScrollText } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { titleCase, formatDateTime, formatCurrency } from "@/lib/formatters";
import { ApiError } from "@/lib/api";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";
import * as activityLogsService from "@/services/activityLogs";

const ACTION_TONE = {
  FUND_CREATED: "ACTIVE",
  MEMBER_ADDED: "ACTIVE",
  ROLE_CHANGED: "PENDING",
  LOAN_CREATED: "ACTIVE",
  LOAN_UPDATED: "PENDING",
  PAYMENT_RECORDED: "ACTIVE",
  PAYMENT_UPDATED: "PENDING",
  FINE_ADDED: "REVERSED",
  FINE_CANCELLED: "CANCELLED",
  EXPENSE_ADDED: "REVERSED",
};

export default function ActivityLogsPage() {
  const router = useRouter();
  const { fundId } = router.query;
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState("");
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setLogs(null);
    activityLogsService
      .getActivityLogs(fundId, { limit: 200, skip: 0 })
      .then(setLogs)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load activity logs."));
  }, [fundId]);

  useEffect(load, [load]);

  const columns = [
    {
      key: "action",
      header: "Action",
      render: (l) => <Badge tone={ACTION_TONE[l.action] || "MEMBER"}>{titleCase(l.action)}</Badge>,
    },
    {
      key: "admin_id",
      header: "Performed By",
      render: (l) => getMemberDisplayName(l.admin_id, memberNameMap, l.admin_id || "—"),
    },
    {
      key: "member_id",
      header: "Affected Member",
      render: (l) => getMemberDisplayName(l.member_id, memberNameMap, l.member_id || "—"),
    },
    {
      key: "amount",
      header: "Amount",
      render: (l) => {
        const nv = l.new_value || {};
        const ov = l.old_value || {};
        const keys = ["payment_amount", "amount", "loan_amount", "cash_given", "disbursed_amount", "remaining_amount"];
        let val = null;
        for (const k of keys) {
          if (nv[k] != null) {
            val = nv[k];
            break;
          }
        }
        if (val == null) {
          for (const k of keys) {
            if (ov[k] != null) {
              val = ov[k];
              break;
            }
          }
        }
        return val != null ? formatCurrency(val) : "—";
      },
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      render: (l) => formatDateTime(l.created_at),
    },
  ];

  return (
    <AppShell title="Activity Logs" requireAdmin>
      <p className="mb-4 text-sm text-ledger-slate-500">
        Every financial and administrative action in this fund, in an immutable audit trail.
      </p>
      <Card padded={false}>
        <DataTable
          columns={columns}
          data={logs}
          loading={logs === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search activity"
          pageSize={20}
          rowKey={(l) => l.id}
          emptyIcon={ScrollText}
          emptyTitle="No activity yet"
          emptyDescription="Actions taken in this fund will be logged here."
        />
      </Card>
    </AppShell>
  );
}
