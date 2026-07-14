import { api } from "@/lib/api";

// POST /funds/{fundId}/payments { loan_id, amount }  (admin only)
export async function recordPayment(fundId, payload) {
  return api.post(`/funds/${fundId}/payments`, payload);
}

// GET /funds/{fundId}/payments
export async function getAllPayments(fundId) {
  return api.get(`/funds/${fundId}/payments`);
}

// GET /funds/{fundId}/payments/loan/{loanId}
export async function getLoanPayments(fundId, loanId) {
  return api.get(`/funds/${fundId}/payments/loan/${loanId}`);
}

// GET /funds/{fundId}/payments/member/{memberId}
export async function getMemberPayments(fundId, memberId) {
  return api.get(`/funds/${fundId}/payments/member/${memberId}`);
}

// GET /funds/{fundId}/payments/{paymentId}
export async function getPayment(fundId, paymentId) {
  return api.get(`/funds/${fundId}/payments/${paymentId}`);
}

// PATCH /funds/{fundId}/payments/{paymentId} { amount }
export async function updatePayment(fundId, paymentId, amount) {
  return api.patch(`/funds/${fundId}/payments/${paymentId}`, { amount });
}
