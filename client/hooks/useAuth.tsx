import * as React from "react";
import type { AuthUser } from "@shared/api";
import { api } from "@/lib/api";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => api.setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(email: string, password: string) {
    const res = await api.login(email, password);
    api.setToken(res.token);
    setUser(res.user);
  }

  async function handleRegister(email: string, password: string) {
    const res = await api.register(email, password);
    api.setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    api.setToken(null);
    setUser(null);
  }

  const value: AuthContextType = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


