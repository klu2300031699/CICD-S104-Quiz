import serverless from "serverless-http";
import { createServer } from "../server";
import { Request, Response, NextFunction } from "express";

const app = createServer();

// Add error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// Wrap serverless handler to catch errors
const handler = serverless(app);
export default async (req: Request, res: Response) => {
  try {
    return await handler(req, res);
  } catch (err) {
    console.error('Serverless error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      })
    };
  }
};
