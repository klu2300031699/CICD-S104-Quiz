import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type User = { id: string; email: string; role?: string };
type Result = { id: string; userId: string; createdAt: string; score: number; attempted: number; correct: number; timeTaken: number; email: string };

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userResults, setUserResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([api.adminListUsers(), api.adminListResults()]);
      setUsers(u.users);
      setResults(r.results);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      await api.adminDeleteUser(userId);
      await loadData(); // Reload data
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to delete user");
    }
  }

  async function handleViewUserResults(user: User) {
    try {
      const response = await api.adminGetUserResults(user.id);
      setSelectedUser(user);
      setUserResults(response.results);
    } catch (e: any) {
      setError(e?.message || "Failed to load user results");
    }
  }

  function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-16">
        <div className="text-sm text-muted-foreground">You must be an admin to view this page.</div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
      
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Users Section */}
        <div className="rounded-2xl border bg-card p-6 shadow-brand">
          <h2 className="text-lg font-semibold mb-4">Registered Users</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground">No users</div>
            ) : (
              users.map((u) => (
                <div key={u.id} className="rounded-lg border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{u.email}</div>
                      <div className="text-xs text-muted-foreground">{u.role?.toUpperCase()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUserResults(u)}
                      >
                        View Results
                      </Button>
                      {u.role !== 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {u.email}? This will also delete all their quiz results. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(u.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All Results Section */}
        <div className="rounded-2xl border bg-card p-6 shadow-brand">
          <h2 className="text-lg font-semibold mb-4">All Quiz Results</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : results.length === 0 ? (
              <div className="text-sm text-muted-foreground">No results</div>
            ) : (
              results.map((r) => (
                <div key={r.id} className="rounded-lg border bg-background p-3">
                  <div className="text-sm font-medium">{r.email} — {r.score}%</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()} • 
                    Attempted {r.attempted} • Correct {r.correct} • 
                    Time {formatTime(r.timeTaken)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Results Section */}
        <div className="rounded-2xl border bg-card p-6 shadow-brand">
          <h2 className="text-lg font-semibold mb-4">
            {selectedUser ? `${selectedUser.email} Results` : "Select a User"}
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {!selectedUser ? (
              <div className="text-sm text-muted-foreground">Click "View Results" on a user to see their quiz history</div>
            ) : userResults.length === 0 ? (
              <div className="text-sm text-muted-foreground">No results for this user</div>
            ) : (
              userResults.map((r) => (
                <div key={r.id} className="rounded-lg border bg-background p-3">
                  <div className="text-sm font-medium">Score: {r.score}%</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()} • 
                    Attempted {r.attempted} • Correct {r.correct} • 
                    Time {formatTime(r.timeTaken)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


