import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, BookOpen, Landmark, Menu } from "lucide-react";
import { useFund } from "@/contexts/FundContext";
import { useState } from "react";
import { MoreSheet } from "./MoreSheet";

export function BottomNav() {
  const router = useRouter();
  const { fund, isAdmin } = useFund();
  const [moreOpen, setMoreOpen] = useState(false);

  if (!fund) return null;

  const items = [
    isAdmin
      ? { href: `/funds/${fund.id}/dashboard`, label: "Dashboard", icon: LayoutDashboard }
      : { href: `/funds/${fund.id}/ledger`, label: "Ledger", icon: BookOpen },
    { href: `/funds/${fund.id}/ledger`, label: "Ledger", icon: BookOpen, hideIfMember: !isAdmin },
    isAdmin ? { href: `/funds/${fund.id}/loans`, label: "Loans", icon: Landmark } : null,
  ].filter(Boolean);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-ledger-border bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {items.map((item) => {
          const active = router.asPath.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                active ? "text-ledger-navy-700" : "text-ledger-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-ledger-slate-500"
        >
          <Menu className="h-5 w-5" />
          More
        </button>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
