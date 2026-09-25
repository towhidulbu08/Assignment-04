import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { jwtUtils } from "../utils/jwt";

// Extend Express's Request type so req.user is typed everywhere.
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: UserRole;
      };
    }
  }
}

// Checks the Authorization header, verifies the JWT, and attaches
// the decoded payload to req.user so downstream controllers/middlewares
// know who is making the request.
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    console.log("Token found in request:");

    const token = req.cookies?.accessToken
      ? req.cookies?.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    console.log("req.headers.authorization", req.headers.authorization);

    if (!token) {
      throw new ApiError(
        401,
        "You are not logged in! Please log in to get access.",
      );
    }

    const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifyToken.success) {
      throw new ApiError(401, verifyToken.error);
    }

    const { id, email, name, role } = verifyToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error("User not found. Please log in again");
    }

    if (user.status === "SUSPENDED") {
      throw new ApiError(403, "Your account has been Suspended");
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (err) {
    console.log("Auth middleware error:", err);
    next(err);
  }
}
