import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { loginHandler, meHandler, registerHandler } from "./routes/auth";
import { createResultHandler, listResultsHandler } from "./routes/results";
import { listAllResults, listUsers, deleteUser, getUserResults } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/register", registerHandler);
  app.post("/api/auth/login", loginHandler);
  app.get("/api/auth/me", meHandler);

  // Results
  app.get("/api/results", listResultsHandler);
  app.post("/api/results", createResultHandler);

  // Admin
  app.get("/api/admin/users", listUsers);
  app.get("/api/admin/results", listAllResults);
  app.delete("/api/admin/users/:userId", deleteUser);
  app.get("/api/admin/users/:userId/results", getUserResults);

  return app;
}
