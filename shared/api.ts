/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}

// Results
export interface QuizResult {
  id: string;
  userId: string;
  createdAt: string; // ISO string
  score: number;
  attempted: number;
  correct: number;
  timeTaken: number; // seconds
}

export interface ListResultsResponse {
  results: QuizResult[];
}

export interface CreateResultRequest {
  score: number;
  attempted: number;
  correct: number;
  timeTaken: number;
}

