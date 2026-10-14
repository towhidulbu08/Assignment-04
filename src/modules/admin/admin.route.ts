import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import * as adminController from "./admin.controller";
// import { validate } from "../../middlewares/validate.middleware";

const router = Router();

// Every route below requires: logged in AND role === ADMIN
router.use(authMiddleware, roleMiddleware("ADMIN"));

// const updateStatusSchema = z.object({
//   body: z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) }),
// });

router.get("/users", adminController.getAllUsers);
router.patch(
  "/users/:id",
  // validate(updateStatusSchema),
  adminController.updateUserStatus,
);
router.get("/gear", adminController.getAllGear);
router.get("/rentals", adminController.getAllRentals);

export const adminRoutes = router;
