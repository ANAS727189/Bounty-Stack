import { Request, Response, NextFunction } from 'express';


type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // Using any for simplicity, can be more specific

/**
 * Wraps an async function to catch errors and pass them to the next middleware (error handler).
 * @param fn The async controller function to wrap.
 * @returns A standard Express middleware function.
 */
export const asyncController = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next); // Catches promise rejections and passes them to next()
  };
};