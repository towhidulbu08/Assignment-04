import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import * as authService from "./auth.service";

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role, phone, address } = req.body;

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Name is required");
  }
  if (!email || typeof email !== "string") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required");
  }

  // এটাই আসল সুরক্ষা — runtime এ actual value চেক করছে
  if (role !== undefined && !["CUSTOMER", "PROVIDER"].includes(role)) {
    throw new ApiError(400, "Role must be either CUSTOMER or PROVIDER");
  }
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string") {
    throw new ApiError(400, "Email is required");
  }
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required");
  }
  const result = await authService.loginUser(email, password);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: user,
  });
});
