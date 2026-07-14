import { api, setToken, setStoredUser } from "@/lib/api";

// POST /auth/register  { name, phone, password } -> UserResponse
export async function register({ name, phone, password }) {
  return api.post("/auth/register", { name, phone, password });
}

// POST /auth/login  { phone, password } -> { access_token, token_type, user }
export async function login({ phone, password }) {
  const data = await api.post("/auth/login", { phone, password });
  setToken(data.access_token);
  setStoredUser(data.user);
  return data;
}

export function logout() {
  setToken(null);
  setStoredUser(null);
}
