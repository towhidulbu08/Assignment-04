import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import * as reviewController from "./review.controller";
// import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  // validate(createReviewSchema),
  reviewController.createReview,
);

export const reviewRoutes = router;
