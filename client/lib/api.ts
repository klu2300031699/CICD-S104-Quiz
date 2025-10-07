import type {
  AuthResponse,
  MeResponse,
  ListResultsResponse,
  CreateResultRequest,
} from "@shared/api";

const API_BASE = import.meta.env.PROD ? window.location.origin : ""; // Use full origin in production

function getToken() {
  return localStorage.getItem("auth_token");
}

function setToken(token: string | null) {
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
}

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `HTTP ${res.status}: ${data.error || 'Unknown error'}`);
    }
    
    return data;
  } catch (err) {
    console.error(`API Error (${path}):`, err);
    throw err;
  }
}

export const api = {
  setToken,
  getToken,
  async register(email: string, password: string) {
    return http<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async login(email: string, password: string) {
    return http<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async me() {
    return http<MeResponse>("/api/auth/me");
  },
  async listResults() {
    return http<ListResultsResponse>("/api/results");
  },
  async createResult(payload: CreateResultRequest) {
    return http<{ result: any }>("/api/results", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async adminListUsers() {
    return http<{ users: { id: string; email: string; role?: string }[] }>("/api/admin/users");
  },
  async adminListResults() {
    return http<{ results: any[] }>("/api/admin/results");
  },
  async adminDeleteUser(userId: string) {
    return http<{ message: string }>(`/api/admin/users/${userId}`, { method: "DELETE" });
  },
  async adminGetUserResults(userId: string) {
    return http<{ user: any; results: any[] }>(`/api/admin/users/${userId}/results`);
  },
};


