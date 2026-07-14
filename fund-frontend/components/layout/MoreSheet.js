import Link from "next/link";
import { Users, Receipt, ShieldAlert, Wallet, ScrollText, FileText, LogOut, Repeat } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useFund } from "@/contexts/FundContext";

export function MoreSheet({ open, onClose }) {
  const { user, logout } = useAuth();
  const { fund, isAdmin, isSuperAdmin } = useFund();

  if (!fund) return null;

  const items = [
    { href: `/funds/${fund.id}/payments`, label: "Payments", icon: Wallet, adminOnly: true },
    { href: `/funds/${fund.id}/fines`, label: "Fines", icon: ShieldAlert, adminOnly: true },
    { href: `/funds/${fund.id}/expenses`, label: "Expenses", icon: Receipt, adminOnly: true },
    { href: `/funds/${fund.id}/members`, label: "Members", icon: Users, superAdminOnly: true },
    { href: `/funds/${fund.id}/activity-logs`, label: "Activity Logs", icon: ScrollText, adminOnly: true },
    { href: `/funds/${fund.id}/reports`, label: "Reports", icon: FileText, adminOnly: true },
    { href: `/funds`, label: "Switch Fund", icon: Repeat },
  ].filter((i) => (i.superAdminOnly ? isSuperAdmin : i.adminOnly ? isAdmin : true));

  return (
    <Modal open={open} onClose={onClose} title={user?.name || "Menu"}>
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ledger-ink hover:bg-ledger-bg"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-ledger-red-600 hover:bg-ledger-red-500/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </Modal>
  );
}
