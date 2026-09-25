import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ApiError } from "../utils/ApiError";
// import { Prisma } from "../../generated/prisma";

// This must be registered LAST in app.ts (after all routes).
// Express recognizes it as an error handler because it has 4 arguments.
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1) Our own thrown ApiError (validation, not found, forbidden, etc.)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // 2) Prisma known errors (e.g. unique constraint, record not found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field: ${err.meta?.target}`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Requested record was not found",
      });
    }
  }

  // 3) Anything else - unexpected/unhandled error
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
}

// Catches requests to routes that don't exist at all (404).
export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
