import { Request, Response, NextFunction } from 'express';
import { GlobalError } from '../utils/globalError';


export const errorHandler = (
  err: Error | GlobalError,
  req: Request,
  res: Response,
  next: NextFunction 
): void => {
  let statusCode = 500;
  let status: 'fail' | 'error' = 'error';
  let message = 'Something went very wrong!';

  if (err instanceof GlobalError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else {
    console.error('💥 UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    status,
    message,
  });
};