import { api } from "@/lib/api";

// POST /funds { fund_name, contribution_amount, previous_balance, super_admin_password }
export async function createFund(payload) {
  return api.post("/funds", payload);
}

// GET /funds -> FundResponse[]
export async function getFunds() {
  return api.get("/funds");
}

// GET /funds/{fundId}
export async function getFund(fundId) {
  return api.get(`/funds/${fundId}`);
}

// GET /funds/{fundId}/balance -> { current_balance }
export async function getFundBalance(fundId) {
  return api.get(`/funds/${fundId}/balance`);
}
