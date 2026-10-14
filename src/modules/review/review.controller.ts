import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import * as reviewService from "./review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await reviewService.createReview({
    customerId: req.user!.id,
    rentalOrderId: req.body.rentalOrderId,
    gearItemId: req.body.gearItemId,
    rating: req.body.rating,
    comment: req.body.comment,
  });
  res.status(201).json({ success: true, message: "Review submitted successfully", data: review });
});
