import express, { Request, Response } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import testRoutes from "./testRoutes";
import aiRoutes from "./aiRoutes";
import testAttemptRoutes from "./testAttempt";
import notificationRoutes from "./notificationRoutes";
import adminDashboardRoutes from "./adminDashboardRoutes";
import studentDashboardRoutes from "./studentDashboardRoutes";
import { handleError } from "../utils";

const router = express.Router();

// Health check route
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("🚀 Backend is running!");
});

// Mount other routes
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/ai", aiRoutes);
router.use("/testAttempt", testAttemptRoutes);
router.use("/notification", notificationRoutes);
router.use("/admin", adminDashboardRoutes);
router.use("/student", studentDashboardRoutes);

export default router;
