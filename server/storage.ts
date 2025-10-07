import fs from "fs";
import path from "path";

const dataDir = path.resolve(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");
const resultsFile = path.join(dataDir, "results.json");

type StoredUser = { id: string; email: string; passwordHash: string };
type StoredResult = {
  id: string;
  userId: string;
  createdAt: string;
  score: number;
  attempted: number;
  correct: number;
  timeTaken: number;
};

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export const storage = {
  // Users
  getUsers(): StoredUser[] {
    return readJson<StoredUser[]>(usersFile, []);
  },
  saveUsers(users: StoredUser[]) {
    writeJson(usersFile, users);
  },
  // Results
  getResults(): StoredResult[] {
    return readJson<StoredResult[]>(resultsFile, []);
  },
  saveResults(results: StoredResult[]) {
    writeJson(resultsFile, results);
  },
};

export type { StoredUser, StoredResult };


