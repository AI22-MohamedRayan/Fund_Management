import { api } from "@/lib/api";

// POST /funds/{fundId}/loans { member_id, loan_amount }  (admin only)
export async function createLoan(fundId, payload) {
  return api.post(`/funds/${fundId}/loans`, payload);
}

// GET /funds/{fundId}/loans
export async function getAllLoans(fundId) {
  return api.get(`/funds/${fundId}/loans`);
}

// GET /funds/{fundId}/loans/active
export async function getActiveLoans(fundId) {
  return api.get(`/funds/${fundId}/loans/active`);
}

// GET /funds/{fundId}/loans/member/{memberId}
export async function getMemberLoans(fundId, memberId) {
  return api.get(`/funds/${fundId}/loans/member/${memberId}`);
}

// GET /funds/{fundId}/loans/{loanId}
export async function getLoan(fundId, loanId) {
  return api.get(`/funds/${fundId}/loans/${loanId}`);
}
