import { NextFunction, Request, Response } from "express";

// Wraps an async controller so any thrown error / rejected promise
// automatically goes to Express's error-handling middleware via next(err).
// Without this, every controller would need its own try/catch block.
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
