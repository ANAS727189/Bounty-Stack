// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mainRouter from './routes/index';
import { GlobalError } from './utils/globalError';
import { errorHandler } from './middlewares/errorhandler.middlewares';

dotenv.config(); // Load environment variables

const app: Express = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use('/api/v1', mainRouter); // Prefix all routes with /api/v1

// --- 404 Handler ---
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new GlobalError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handler ---
app.use(errorHandler);

export default app;