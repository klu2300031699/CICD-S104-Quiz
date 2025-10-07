import { RequestHandler } from "express";
import { db } from "../db";
import { AuthUtils } from "./auth";

function requireAdmin(req: any, res: any): { ok: boolean; email?: string } {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return { ok: false };
  }
  const { valid, payload } = AuthUtils.verifyToken(token);
  if (!valid) {
    res.status(401).json({ error: "Invalid token" });
    return { ok: false };
  }
  const email = payload?.email as string | undefined;
  if (!email) {
    res.status(401).json({ error: "Unauthorized" });
    return { ok: false };
  }
  const user = db.getUserByEmail(email);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return { ok: false };
  }
  return { ok: true, email };
}

export const listUsers: RequestHandler = (req, res) => {
  if (!requireAdmin(req, res).ok) return;
  const users = db.getAllUsers().map(u => ({ id: u.id, email: u.email, role: u.role }));
  res.json({ users });
};

export const listAllResults: RequestHandler = (req, res) => {
  if (!requireAdmin(req, res).ok) return;
  const allResults = db.getAllResults();
  const allUsers = db.getAllUsers();
  const results = allResults.map(r => {
    const user = allUsers.find(u => u.id === r.userId);
    return {
      id: r.id,
      userId: r.userId,
      createdAt: r.createdAt,
      score: r.score,
      attempted: r.attempted,
      correct: r.correct,
      timeTaken: r.timeTaken,
      email: user?.email || 'Unknown'
    };
  });
  res.json({ results });
};

export const deleteUser: RequestHandler = (req, res) => {
  if (!requireAdmin(req, res).ok) return;
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "User ID required" });
  
  // Check if user exists
  const user = db.getAllUsers().find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  // Don't allow deleting admin users
  if (user.role === 'admin') return res.status(403).json({ error: "Cannot delete admin user" });
  
  // Delete user and their results
  db.deleteUser(userId);
  res.json({ message: "User deleted successfully" });
};

export const getUserResults: RequestHandler = (req, res) => {
  if (!requireAdmin(req, res).ok) return;
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "User ID required" });
  
  const user = db.getAllUsers().find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  const results = db.getResultsByUserId(userId);
  res.json({ user, results });
};


