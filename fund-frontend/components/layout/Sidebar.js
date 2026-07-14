import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Landmark,
  Receipt,
  ShieldAlert,
  Wallet,
  ScrollText,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFund } from "@/contexts/FundContext";
import { initials } from "@/lib/formatters";

function navItems(fundId, isAdmin, isSuperAdmin) {
  const items = [
    { href: `/funds/${fundId}/dashboard`, label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
    { href: `/funds/${fundId}/ledger`, label: "Public Ledger", icon: BookOpen },
    { href: `/funds/${fundId}/loans`, label: "Loans", icon: Landmark, adminOnly: true },
    { href: `/funds/${fundId}/payments`, label: "Payments", icon: Wallet, adminOnly: true },
    { href: `/funds/${fundId}/fines`, label: "Fines", icon: ShieldAlert, adminOnly: true },
    { href: `/funds/${fundId}/expenses`, label: "Expenses", icon: Receipt, adminOnly: true },
    { href: `/funds/${fundId}/members`, label: "Members", icon: Users, superAdminOnly: true },
    { href: `/funds/${fundId}/activity-logs`, label: "Activity Logs", icon: ScrollText, adminOnly: true },
    { href: `/funds/${fundId}/reports`, label: "Reports", icon: FileText, adminOnly: true },
  ];
  return items.filter((i) => (i.superAdminOnly ? isSuperAdmin : i.adminOnly ? isAdmin : true));
}

export function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { fund, isAdmin, isSuperAdmin, role } = useFund();

  if (!fund) return null;
  const items = navItems(fund.id, isAdmin, isSuperAdmin);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ledger-border bg-white lg:flex">
      <div className="border-b border-ledger-border px-5 py-5">
        <p className="font-display text-sm font-semibold text-ledger-ink">{fund.fund_name}</p>
        <p className="mt-0.5 text-xs text-ledger-slate-500">
          Contribution {"\u20B9"}
          {fund.contribution_amount}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = router.asPath.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-ledger-navy-700 text-white"
                  : "text-ledger-slate-600 hover:bg-ledger-bg hover:text-ledger-ink"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ledger-border p-3">
        <Link
          href="/funds"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ledger-slate-600 hover:bg-ledger-bg"
        >
          Switch Fund
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ledger-navy-700 text-xs font-semibold text-white">
            {initials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ledger-ink">{user?.name}</p>
            <p className="truncate text-xs text-ledger-slate-500">{role ? role.replace("_", " ") : ""}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ledger-slate-500 hover:bg-ledger-bg"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
