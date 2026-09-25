import express from "express";

import { authRoutes } from "./modules/auth/auth.route";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware";
import { gearRoutes } from "./modules/gear/gear.route";
import { rentalRoutes } from "./modules/rental/rental.route";

export const app = express();

app.use(express.json());

// ---- Health check ----
app.get("/", (_req, res) => {
  res.json({ success: true, message: "GearUp API is running 🏋️" });
});

// ---- Module routes ----
app.use("/api/auth", authRoutes);
app.use("/api", gearRoutes); // exposes /api/gear, /api/gear/:id, /api/categories
app.use("/api/rentals", rentalRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/provider", providerRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/admin", adminRoutes);

// ---- 404 + global error handler (must be registered LAST) ----
app.use(notFoundMiddleware);
app.use(errorMiddleware);
