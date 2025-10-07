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
    "Accept": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  try {
    console.log(`Making ${options.method || 'GET'} request to ${path}`);
    
    const res = await fetch(`${API_BASE}${path}`, { 
      ...options, 
      headers,
      credentials: 'same-origin'
    });
    
    let data;
    try {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response is not JSON:', text);
        throw new Error('Server returned invalid JSON');
      }
    } catch (e) {
      console.error('Error reading response:', e);
      throw new Error('Could not read server response');
    }
    
    if (!res.ok) {
      const error = new Error(data.message || data.error || `HTTP ${res.status}`);
      (error as any).status = res.status;
      (error as any).data = data;
      throw error;
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


