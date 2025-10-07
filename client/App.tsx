import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/40 via-background to-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">Quiz Portal</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/results" className="hover:text-foreground">Results</Link>
            {user?.role === 'admin' && <Link to="/admin" className="hover:text-foreground">Admin</Link>}
            {!user && <Link to="/login" className="hover:text-foreground">Login</Link>}
            {!user && <Link to="/register" className="hover:text-foreground">Register</Link>}
            {user && (
              <button onClick={logout} className="hover:text-foreground">Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container">20 Questions • 30 Minutes</div>
      </footer>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/results" element={<Layout><Results /></Layout>} />
            <Route path="/admin" element={<Layout><Admin /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
