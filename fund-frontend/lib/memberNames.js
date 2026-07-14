import { useEffect, useState } from "react";
import * as ledgerService from "@/services/ledger";

export function buildMemberNameMap(ledgerRows = []) {
  return (ledgerRows || []).reduce((acc, row) => {
    if (row?.member_id != null && row.member_name) {
      acc[String(row.member_id)] = row.member_name;
    }
    return acc;
  }, {});
}

export function getMemberDisplayName(memberId, memberNameMap, fallback = memberId) {
  if (!memberId) return "—";

  const key = String(memberId);
  if (memberNameMap?.[key]) {
    return memberNameMap[key];
  }

  return fallback ?? "Unknown member";
}

export function useMemberNameMap(fundId) {
  const [memberNameMap, setMemberNameMap] = useState({});
  const [loading, setLoading] = useState(Boolean(fundId));

  useEffect(() => {
    if (!fundId) {
      setMemberNameMap({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    ledgerService
      .getPublicLedger(fundId)
      .then((rows) => {
        if (!cancelled) {
          setMemberNameMap(buildMemberNameMap(rows));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMemberNameMap({});
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fundId]);

  return { memberNameMap, loading };
}
