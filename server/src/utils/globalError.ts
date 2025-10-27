// src/utils/globalError.ts
export class GlobalError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational: boolean; // Mark errors created by us vs. programming errors

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Assumes errors we create are operational

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}