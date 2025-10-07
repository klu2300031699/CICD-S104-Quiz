import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { json } from 'express';
import { authRouter } from '../server/routes/auth';
import { adminRouter } from '../server/routes/admin';
import { resultsRouter } from '../server/routes/results';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/results', resultsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the serverless handler
export default serverless(app);
