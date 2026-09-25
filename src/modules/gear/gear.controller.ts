import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as gearService from "./gear.service";

export const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const gearItems = await gearService.getAllGear(req.query as any);
  res.status(200).json({
    success: true,
    message: "Gear items fetched successfully",
    data: gearItems,
  });
});

export const getGearById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const gear = await gearService.getGearById(id);
  res.status(200).json({
    success: true,
    message: "Gear item fetched successfully",
    data: gear,
  });
});

export const getAllCategories = catchAsync(
  async (_req: Request, res: Response) => {
    const categories = await gearService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  },
);
