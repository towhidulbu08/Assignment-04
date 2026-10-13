import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as providerService from "./provider.service";

export const addGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await providerService.addGear({
    providerId: req.user!.id,
    ...req.body,
  });
  res
    .status(201)
    .json({ success: true, message: "Gear added successfully", data: gear });
});

export const updateGear = catchAsync(async (req: Request, res: Response) => {
  const gear = await providerService.updateGear(
    req.params.id as string,
    req.user!.id,
    req.body,
  );
  res
    .status(200)
    .json({ success: true, message: "Gear updated successfully", data: gear });
});

export const deleteGear = catchAsync(async (req: Request, res: Response) => {
  await providerService.deleteGear(req.params.id as string, req.user!.id);
  res
    .status(200)
    .json({ success: true, message: "Gear deleted successfully", data: null });
});

export const getProviderOrders = catchAsync(
  async (req: Request, res: Response) => {
    const orders = await providerService.getProviderOrders(req.user!.id);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  },
);

export const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const order = await providerService.updateOrderStatus(
      req.params.id as string,
      req.user!.id,
      req.body.status,
    );
    res
      .status(200)
      .json({ success: true, message: "Order status updated", data: order });
  },
);
