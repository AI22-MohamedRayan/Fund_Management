import { api } from "@/lib/api";

// POST /funds/{fundId}/expenses { amount, description }  (admin only)
export async function createExpense(fundId, payload) {
  return api.post(`/funds/${fundId}/expenses`, payload);
}

// GET /funds/{fundId}/expenses
export async function getAllExpenses(fundId) {
  return api.get(`/funds/${fundId}/expenses`);
}

// GET /funds/{fundId}/expenses/latest
export async function getLatestExpenses(fundId) {
  return api.get(`/funds/${fundId}/expenses/latest`);
}

// GET /funds/{fundId}/expenses/total -> { total_expenses }
export async function getTotalExpenses(fundId) {
  return api.get(`/funds/${fundId}/expenses/total`);
}
