import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import * as rentalController from "./rental.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  rentalController.createRental,
);
router.get("/", authMiddleware, rentalController.getRentals);
router.get("/:id", authMiddleware, rentalController.getRentalById);

export const rentalRoutes = router;
