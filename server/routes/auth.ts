import { RequestHandler } from "express";
import crypto from "crypto";
import { db, hashPassword as dbHash } from "../db";

type User = { id: string; email: string; passwordHash: string; role: string };

function getUserByEmail(email: string): User | undefined {
  return db.getUserByEmail(email);
}

// Very small demo token util (HMAC-signed JSON). For production use JWT or a proper session.
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signToken(payload: Record<string, unknown>): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  const body = { ...payload, exp };
  const h = base64url(JSON.stringify(header));
  const b = base64url(JSON.stringify(body));
  const data = `${h}.${b}`;
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyToken(token: string): { valid: boolean; payload?: any } {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false };
  const [h, b, sig] = parts;
  const data = `${h}.${b}`;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  if (sig !== expected) return { valid: false };
  try {
    const payload = JSON.parse(Buffer.from(b, "base64").toString("utf8"));
    if (payload.exp && Date.now() / 1000 > payload.exp) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

function hashPassword(password: string) { return dbHash(password); }

export const registerHandler: RequestHandler = async (req, res) => {
  try {
    console.log('Register request:', { body: req.body });
    
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: "email and password are required" });
    }
    
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ error: "User already exists" });
    }
    
    const user: User = { 
      id: crypto.randomUUID(), 
      email, 
      passwordHash: hashPassword(password), 
      role: "user" 
    };
    
    db.createUser(user);
    const token = signToken({ sub: user.id, email: user.email });
    
    console.log('User registered successfully:', email);
    return res.status(201).json({ 
      success: true,
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const loginHandler: RequestHandler = async (req, res) => {
  try {
    console.log('Login request:', { body: req.body });
    
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: "email and password are required" });
    }
    
    const user = getUserByEmail(email);
    console.log('User found:', !!user);
    
    if (!user || user.passwordHash !== hashPassword(password)) {
      console.log('Invalid credentials for:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    console.log('Login successful:', email);
    
    return res.status(200).json({ 
      success: true,
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
};

export const meHandler: RequestHandler = (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing token" });
  const { valid, payload } = verifyToken(token);
  if (!valid) return res.status(401).json({ error: "Invalid token" });
  const email: string | undefined = payload?.email;
  if (!email) return res.status(404).json({ error: "User not found" });
  const user = getUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
};

// Export for other modules that need verification
export const AuthUtils = { verifyToken };


