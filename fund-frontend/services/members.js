import { api } from "@/lib/api";

// GET /funds/{fundId}/members  (super admin only)
export async function getMembers(fundId) {
  return api.get(`/funds/${fundId}/members`);
}

// GET /funds/{fundId}/members/search?search=&limit=  (super admin only)
export async function searchUsers(fundId, search, limit = 10) {
  return api.get(`/funds/${fundId}/members/search`, { params: { search, limit } });
}

// POST /funds/{fundId}/members { user_id }  (super admin only)
export async function addMember(fundId, userId) {
  return api.post(`/funds/${fundId}/members`, { user_id: userId });
}

// PATCH /funds/{fundId}/members/role { user_id, role: 'ADMIN' | 'MEMBER' }
export async function updateMemberRole(fundId, userId, role) {
  return api.patch(`/funds/${fundId}/members/role`, { user_id: userId, role });
}
