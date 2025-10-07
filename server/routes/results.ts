import { RequestHandler } from "express";
import { AuthUtils } from "./auth";
import type { QuizResult, CreateResultRequest } from "@shared/api";
import { db } from "../db";

// In-memory results by user id
function listByUserId(userId: string): QuizResult[] {
  return db.getResultsByUserId(userId);
}

function getUserIdFromAuthHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;
  const { valid, payload } = AuthUtils.verifyToken(token);
  if (!valid) return null;
  const sub = payload?.sub as string | undefined;
  return sub ?? null;
}

export const listResultsHandler: RequestHandler = (req, res) => {
  const userId = getUserIdFromAuthHeader(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const items = listByUserId(userId);
  res.json({ results: items });
};

export const createResultHandler: RequestHandler = (req, res) => {
  const userId = getUserIdFromAuthHeader(req.headers.authorization);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as CreateResultRequest;
  if (
    typeof body?.score !== "number" ||
    typeof body?.attempted !== "number" ||
    typeof body?.correct !== "number" ||
    typeof body?.timeTaken !== "number"
  ) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const newItem: QuizResult = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    createdAt: new Date().toISOString(),
    score: body.score,
    attempted: body.attempted,
    correct: body.correct,
    timeTaken: body.timeTaken,
  };
  db.createResult(newItem);
  res.status(201).json({ result: newItem });
};


