import { useEffect } from "react";
import { useRouter } from "next/router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Topbar } from "./Topbar";
import { useAuth } from "@/contexts/AuthContext";
import { useFund } from "@/contexts/FundContext";
import { Skeleton } from "@/components/ui/Skeleton";

export function AppShell({ title, children, requireAdmin = false, requireSuperAdmin = false }) {
  const router = useRouter();
  const { user, ready, isAuthenticated } = useAuth();
  const { fund, role, loadingRole, isAdmin, isSuperAdmin, selectFund } = useFund();
  const { fundId } = router.query;

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (fundId && (!fund || fund.id !== fundId)) {
      selectFund(fundId).catch(() => router.replace("/funds"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isAuthenticated, fundId]);

  const loading = !ready || (fundId && (!fund || loadingRole));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ledger-bg p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <AccessDenied message="Only the Super Admin can view this page." />;
  }
  if (requireAdmin && !isAdmin) {
    return <AccessDenied message="Only Admins and the Super Admin can view this page." />;
  }

  return (
    <div className="flex min-h-screen bg-ledger-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
          <h1 className="mb-5 hidden font-display text-xl font-semibold text-ledger-ink lg:block">
            {title}
          </h1>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function AccessDenied({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ledger-bg p-6">
      <div className="max-w-sm rounded-card border border-ledger-border bg-white p-6 text-center shadow-card">
        <p className="font-display text-base font-semibold text-ledger-ink">Access restricted</p>
        <p className="mt-1.5 text-sm text-ledger-slate-500">{message}</p>
      </div>
    </div>
  );
}
