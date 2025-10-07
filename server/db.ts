import crypto from "crypto";

type User = { id: string; email: string; passwordHash: string; role: string };
type Result = { id: string; userId: string; createdAt: string; score: number; attempted: number; correct: number; timeTaken: number };

// In-memory storage for serverless environment
let inMemoryUsers: User[] = [];
let inMemoryResults: Result[] = [];

function hashPassword(password: string) {
  const salt = "static-demo-salt";
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

// Seed admin if missing
const adminEmail = "Gnanesh@gmail.com";
const adminPass = "Gnanesh@1561";
const adminUser: User = {
  id: crypto.randomUUID(),
  email: adminEmail,
  passwordHash: hashPassword(adminPass),
  role: "admin"
};
inMemoryUsers.push(adminUser);

export const db = {
  // Users
  getUserByEmail(email: string): User | undefined {
    return inMemoryUsers.find(u => u.email === email);
  },
  createUser(user: User) {
    inMemoryUsers.push(user);
  },
  getAllUsers(): User[] {
    return [...inMemoryUsers];
  },
  deleteUser(userId: string) {
    // Remove user
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== userId);
    
    // Remove user's results
    inMemoryResults = inMemoryResults.filter(r => r.userId !== userId);
  },
  
  // Results
  createResult(result: Result) {
    inMemoryResults.push(result);
  },
  getResultsByUserId(userId: string): Result[] {
    return inMemoryResults
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getAllResults(): Result[] {
    return [...inMemoryResults]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};

export { hashPassword };


