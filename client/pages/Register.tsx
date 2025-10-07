import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, password);
      nav("/");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 shadow-brand">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create account"}</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary underline">Login</Link>
        </p>
      </div>
    </div>
  );
}


