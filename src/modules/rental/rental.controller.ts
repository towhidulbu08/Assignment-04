import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as rentalService from "./rental.service";

export const createRental = catchAsync(async (req: Request, res: Response) => {
  const input = {
    customerId: req.user!.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    items: req.body.items,
  };
  const rental = await rentalService.createRental(input);

  res.status(201).json({
    success: true,
    message: "Rental order created successfully",
    data: rental,
  });
});

export const getRentals = catchAsync(async (req: Request, res: Response) => {
  const rentals = await rentalService.getRentalsForUser(
    req.user!.id,
    req.user!.role,
  );
  res.status(200).json({
    success: true,
    message: "Rental orders fetched successfully",
    data: rentals,
  });
});

export const getRentalById = catchAsync(async (req: Request, res: Response) => {
  const rental = await rentalService.getRentalById(
    req.params.id as string,
    req.user!.id,
    req.user!.role,
  );
  res.status(200).json({
    success: true,
    message: "Rental order fetched successfully",
    data: rental,
  });
});
