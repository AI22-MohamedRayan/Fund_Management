import { api } from "@/lib/api";

// POST /funds/{fundId}/fines { loan_id, amount, reason }  (admin only)
export async function createFine(fundId, payload) {
  return api.post(`/funds/${fundId}/fines`, payload);
}

// PATCH /funds/{fundId}/fines/{fineId}/cancel { reason }
export async function cancelFine(fundId, fineId, reason) {
  return api.patch(`/funds/${fundId}/fines/${fineId}/cancel`, { reason });
}

// GET /funds/{fundId}/fines
export async function getAllFines(fundId) {
  return api.get(`/funds/${fundId}/fines`);
}

// GET /funds/{fundId}/fines/active
export async function getActiveFines(fundId) {
  return api.get(`/funds/${fundId}/fines/active`);
}

// GET /funds/{fundId}/fines/member/{memberId}
export async function getMemberFines(fundId, memberId) {
  return api.get(`/funds/${fundId}/fines/member/${memberId}`);
}

// GET /funds/{fundId}/fines/loan/{loanId}
export async function getLoanFines(fundId, loanId) {
  return api.get(`/funds/${fundId}/fines/loan/${loanId}`);
}
