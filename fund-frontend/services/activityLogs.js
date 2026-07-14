import { api } from "@/lib/api";

// GET /funds/{fundId}/activity-logs?limit=&skip=  (admin only)
export async function getActivityLogs(fundId, { limit = 50, skip = 0 } = {}) {
  return api.get(`/funds/${fundId}/activity-logs`, { params: { limit, skip } });
}

// GET /funds/{fundId}/activity-logs/member/{memberId}
export async function getMemberActivityLogs(fundId, memberId, { limit = 50, skip = 0 } = {}) {
  return api.get(`/funds/${fundId}/activity-logs/member/${memberId}`, {
    params: { limit, skip },
  });
}
