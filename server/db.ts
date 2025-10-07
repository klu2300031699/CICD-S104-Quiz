import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDir = path.resolve(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");
const resultsFile = path.join(dataDir, "results.json");

type User = { id: string; email: string; passwordHash: string; role: string };
type Result = { id: string; userId: string; createdAt: string; score: number; attempted: number; correct: number; timeTaken: number };

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

function hashPassword(password: string) {
  const salt = "static-demo-salt";
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

// Initialize data
let users: User[] = readJson(usersFile, []);
let results: Result[] = readJson(resultsFile, []);

// Seed admin if missing
const adminEmail = "Gnanesh@gmail.com";
const adminPass = "Gnanesh@1561";
const existingAdmin = users.find(u => u.email === adminEmail);
if (!existingAdmin) {
  const adminUser: User = {
    id: crypto.randomUUID(),
    email: adminEmail,
    passwordHash: hashPassword(adminPass),
    role: "admin"
  };
  users.push(adminUser);
  writeJson(usersFile, users);
}

export const db = {
  // Users
  getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email === email);
  },
  createUser(user: User) {
    users.push(user);
    writeJson(usersFile, users);
  },
  getAllUsers(): User[] {
    return [...users];
  },
  deleteUser(userId: string) {
    // Remove user
    users = users.filter(u => u.id !== userId);
    writeJson(usersFile, users);
    
    // Remove user's results
    results = results.filter(r => r.userId !== userId);
    writeJson(resultsFile, results);
  },
  
  // Results
  createResult(result: Result) {
    results.push(result);
    writeJson(resultsFile, results);
  },
  getResultsByUserId(userId: string): Result[] {
    return results.filter(r => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getAllResults(): Result[] {
    return [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export { hashPassword };


