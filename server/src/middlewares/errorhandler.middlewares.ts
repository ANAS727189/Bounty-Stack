// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { GlobalError } from '../utils/globalError';

// Basic error handler - expand with development/production modes if needed
export const errorHandler = (
  err: Error | GlobalError,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  let statusCode = 500;
  let status: 'fail' | 'error' = 'error';
  let message = 'Something went very wrong!';

  if (err instanceof GlobalError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
    // Handle specific operational errors if needed
  } else {
    // Log unexpected errors for debugging
    console.error('💥 UNEXPECTED ERROR:', err);
    // Optionally: Send more details in development mode
    // if (process.env.NODE_ENV === 'development') { ... }
  }

  res.status(statusCode).json({
    status,
    message,
    // Optionally include stack in development: stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};