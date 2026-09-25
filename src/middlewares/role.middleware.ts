import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

// Usage: roleMiddleware("ADMIN") or roleMiddleware("ADMIN", "PROVIDER")
// Must run AFTER authMiddleware, since it relies on req.user being set.
export function roleMiddleware(...allowedRoles: Array<"CUSTOMER" | "PROVIDER" | "ADMIN">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    next();
  };
}
