import { Router } from "express";
import * as gearController from "./gear.controller";

const router = Router();

// All public - no auth required
router.get("/gear", gearController.getAllGear);
router.get("/gear/:id", gearController.getGearById);
router.get("/categories", gearController.getAllCategories);

export const gearRoutes = router;
