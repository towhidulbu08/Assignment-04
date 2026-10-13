import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import * as providerController from "./provider.controller";

const router = Router();

// Every route below requires: logged in AND role === PROVIDER
router.use(authMiddleware, roleMiddleware("PROVIDER"));

router.post("/gear", providerController.addGear);
router.put(
  "/gear/:id",

  providerController.updateGear,
);
router.delete("/gear/:id", providerController.deleteGear);
router.get("/orders", providerController.getProviderOrders);
router.patch("/orders/:id", providerController.updateOrderStatus);

export const providerRoutes = router;
