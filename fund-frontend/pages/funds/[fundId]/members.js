import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Users, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AddMemberForm } from "@/components/forms/AddMemberForm";
import { ROLE_LABELS } from "@/lib/constants";
import { ApiError } from "@/lib/api";
import * as membersService from "@/services/members";
import { useFund } from "@/contexts/FundContext";
import toast from "react-hot-toast";
import { getMemberDisplayName, useMemberNameMap } from "@/lib/memberNames";

export default function MembersPage() {
  const router = useRouter();
  const { fundId, new: newParam } = router.query;
  const { refreshMembers } = useFund();
  const [members, setMembers] = useState(null);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [promoteTarget, setPromoteTarget] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const { memberNameMap } = useMemberNameMap(fundId);

  const load = useCallback(() => {
    if (!fundId) return;
    setError("");
    setMembers(null);
    membersService
      .getMembers(fundId)
      .then(setMembers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load members."));
  }, [fundId]);

  useEffect(load, [load]);
  useEffect(() => {
    if (newParam === "1") setAddOpen(true);
  }, [newParam]);

  const handlePromote = async () => {
    setPromoting(true);
    try {
      const nextRole = promoteTarget.role === "ADMIN" ? "MEMBER" : "ADMIN";
      await membersService.updateMemberRole(fundId, promoteTarget.user_id, nextRole);
      toast.success(`Role updated to ${ROLE_LABELS[nextRole]}.`);
      setPromoteTarget(null);
      load();
      refreshMembers?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update role.");
    } finally {
      setPromoting(false);
    }
  };

  const columns = [
    {
      key: "user_id",
      header: "Member",
      render: (m) => (
          <div>
            <p className="font-medium text-ledger-ink">{getMemberDisplayName(m.user_id, memberNameMap, m.user_id)}</p>
            <p className="text-xs text-ledger-slate-500">{m.user_id}</p>
          </div>
        ),
    },
    {
      key: "role",
      header: "Role",
      render: (m) => <Badge tone={m.role}>{ROLE_LABELS[m.role] || m.role}</Badge>,
    },
    {
      key: "contribution_paid",
      header: "Contribution",
      render: (m) => (m.contribution_paid ? <Badge tone="ACTIVE">Paid</Badge> : <Badge tone="PENDING">Pending</Badge>),
    },
    { key: "status", header: "Status", render: (m) => <Badge tone={m.status === "ACTIVE" ? "ACTIVE" : "CANCELLED"}>{m.status}</Badge> },
    {
      key: "actions",
      header: "",
      render: (m) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/funds/${fundId}/members/${m.user_id}`)}
            className="text-xs font-semibold text-ledger-navy-700 hover:underline"
          >
            View Profile
          </button>
          {m.role === "SUPER_ADMIN" ? null : (
            <Button variant="secondary" onClick={() => setPromoteTarget(m)} className="!min-h-0 !py-1.5 !px-3 text-xs">
              {m.role === "ADMIN" ? "Demote" : "Promote"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppShell title="Members" requireSuperAdmin>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card padded={false}>
        <DataTable
          columns={columns}
          data={members}
          loading={members === null && !error}
          error={error}
          onRetry={load}
          searchPlaceholder="Search members"
          rowKey={(m) => m.id}
          emptyIcon={Users}
          emptyTitle="No members yet"
          emptyDescription="Add the first member to this fund."
        />
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Member">
        <AddMemberForm fundId={fundId} onAdded={() => { setAddOpen(false); load(); }} />
      </Modal>

      <ConfirmDialog
        open={!!promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromote}
        loading={promoting}
        title={promoteTarget?.role === "ADMIN" ? "Demote to Member" : "Promote to Admin"}
        description={
          promoteTarget?.role === "ADMIN"
            ? "This member will lose admin privileges."
            : "This member will be able to create loans, record payments, add expenses and cancel fines."
        }
        confirmLabel="Confirm"
        details={promoteTarget ? [{ label: "User ID", value: promoteTarget.user_id }] : null}
      />
    </AppShell>
  );
}
