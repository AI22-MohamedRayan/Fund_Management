import { api } from "@/lib/api";

// GET /funds/{fundId}/dashboard (admin/super admin only)
// -> { current_balance, members, active_loans, interest_earned,
//      fine_collected, expenses, outstanding_amount, pending_payments }
export async function getDashboard(fundId) {
  return api.get(`/funds/${fundId}/dashboard`);
}
