import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { QuizResult } from "@shared/api";
import { useAuth } from "@/hooks/useAuth";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function Results() {
  const { user } = useAuth();
  const [items, setItems] = useState<QuizResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .listResults()
      .then((r) => setItems(r.results))
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight">Results History</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user ? `Signed in as ${user.email}` : "Not signed in"}</p>
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-brand">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="text-sm text-muted-foreground">No results yet.</div>
          )}
          <div className="mt-2 grid gap-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-xl border bg-background p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm">{new Date(r.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Attempted {r.attempted} • Correct {r.correct} • Time {formatTime(r.timeTaken)}</div>
                </div>
                <div className="text-xl font-bold">{r.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


