import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as adminService from "./admin.service";

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res
    .status(200)
    .json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
});

export const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const user = await adminService.updateUserStatus(
      req.params.id as string,
      req.body.status,
    );
    res
      .status(200)
      .json({ success: true, message: "User status updated", data: user });
  },
);

export const getAllGear = catchAsync(async (_req: Request, res: Response) => {
  const gear = await adminService.getAllGearListings();
  res
    .status(200)
    .json({
      success: true,
      message: "Gear listings fetched successfully",
      data: gear,
    });
});

export const getAllRentals = catchAsync(
  async (_req: Request, res: Response) => {
    const rentals = await adminService.getAllRentals();
    res
      .status(200)
      .json({
        success: true,
        message: "Rentals fetched successfully",
        data: rentals,
      });
  },
);
