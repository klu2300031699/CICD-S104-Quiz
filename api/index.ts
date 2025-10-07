import { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer } from "../server";
import { Request, Response } from 'express';
import { IncomingMessage, ServerResponse } from 'http';

const app = createServer();

// Convert Express handler to Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse & Response) {
  try {
    // Parse body if it's a string
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        console.error('Body parse error:', e);
        return res.status(400).json({ 
          error: 'Invalid JSON',
          message: 'The request body must be valid JSON'
        });
      }
    }

    // Create an Express-compatible request object
    const expressReq = Object.assign(req, {
      path: req.url?.replace(/^\/api/, '') || '/',
      baseUrl: '/api',
      originalUrl: req.url || '/',
    }) as unknown as Request;

    console.log(`Processing ${req.method} request to ${req.url}`);

    // Handle the request with Express
    return new Promise<void>((resolve) => {
      let isResolved = false;
      
      // Set a timeout to ensure we always respond
      const timeout = setTimeout(() => {
        if (!isResolved && !res.headersSent) {
          console.error('Request timeout');
          res.status(504).json({ error: 'Request timeout' });
          isResolved = true;
          resolve();
        }
      }, 10000); // 10 second timeout

      // Handle the request with Express
      app(expressReq, res, (err: any) => {
        clearTimeout(timeout);
        
        if (!isResolved) {
          if (err) {
            console.error('Express middleware error:', err);
            res.status(500).json({
              error: 'Internal Server Error',
              message: err instanceof Error ? err.message : 'Unknown error occurred'
            });
          } else if (!res.headersSent) {
            res.status(404).json({ error: 'Route not found' });
          }
          isResolved = true;
          resolve();
        }
      });
    });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error occurred'
    });
  }
}
