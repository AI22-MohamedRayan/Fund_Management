import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { ApiError } from "@/lib/api";
import { getFund } from "@/services/funds";
import { getMembers } from "@/services/members";
import { getDashboard } from "@/services/dashboard";
import { useAuth } from "@/contexts/AuthContext";

/**
 * IMPORTANT — backend gap:
 * There is no `GET /funds/{fund_id}/members/me` (or similar) endpoint that
 * lets a logged-in user fetch their own membership/role for a fund.
 * `GET /funds/{fund_id}/members` (the only endpoint that returns roles) is
 * restricted to Super Admins.
 *
 * Until that endpoint exists, this context determines the current user's
 * role by probing real, already-existing endpoints and reading the
 * authorization result (200 vs 403):
 *
 * 1. Try GET /funds/{fundId}/members
 *    Success -> SUPER_ADMIN
 *
 * 2. Else try GET /funds/{fundId}/dashboard
 *    Success -> ADMIN
 *
 * 3. Else -> MEMBER
 */

const FundContext = createContext(null);

export function FundProvider({ children }) {
  const [fund, setFund] = useState(null);
  const [role, setRole] = useState(null); // MEMBER | ADMIN | SUPER_ADMIN
  const [members, setMembers] = useState(null);
  const [loadingRole, setLoadingRole] = useState(false);

  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const resolveRole = useCallback(async (fundId) => {
    setLoadingRole(true);

    try {
      // Try SUPER_ADMIN
      try {
        const memberList = await getMembers(fundId);
        setMembers(memberList);
        setRole("SUPER_ADMIN");
        return "SUPER_ADMIN";
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 403) {
          if (err instanceof ApiError && err.status === 401) {
            throw err;
          }
        }
      }

      // Try ADMIN
      try {
        await getDashboard(fundId);
        setRole("ADMIN");
        return "ADMIN";
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 403) {
          if (err instanceof ApiError && err.status === 401) {
            throw err;
          }
        }
      }

      // Default to MEMBER
      setRole("MEMBER");
      return "MEMBER";
    } finally {
      // Always stop loading
      setLoadingRole(false);
    }
  }, []);

  const selectFund = useCallback(
    async (fundId) => {
      const fundData = await getFund(fundId);

      setFund(fundData);

      window.localStorage.setItem("fms_active_fund", fundId);

      await resolveRole(fundId);

      return fundData;
    },
    [resolveRole]
  );

  const clearFund = useCallback(() => {
    setFund(null);
    setRole(null);
    setMembers(null);
    setLoadingRole(false);

    window.localStorage.removeItem("fms_active_fund");
  }, []);

  // Restore previously selected fund after refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedId = window.localStorage.getItem("fms_active_fund");

    if (savedId && !fund) {
      selectFund(savedId).catch(() => clearFund());
    }
  }, [isAuthenticated, fund, selectFund, clearFund]);

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";

  return (
    <FundContext.Provider
      value={{
        fund,
        role,
        members,
        loadingRole,
        isAdmin,
        isSuperAdmin,
        selectFund,
        clearFund,
        refreshMembers: () => fund && resolveRole(fund.id),
      }}
    >
      {children}
    </FundContext.Provider>
  );
}

export function useFund() {
  const ctx = useContext(FundContext);

  if (!ctx) {
    throw new Error("useFund must be used within FundProvider");
  }

  return ctx;
}