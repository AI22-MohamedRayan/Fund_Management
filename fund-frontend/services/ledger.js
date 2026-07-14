import { api } from "@/lib/api";

// GET /funds/{fundId}/ledger -> public ledger rows (any authenticated user)
export async function getPublicLedger(fundId) {
  return api.get(`/funds/${fundId}/ledger`);
}
