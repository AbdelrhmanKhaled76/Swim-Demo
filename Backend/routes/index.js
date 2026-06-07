import express from "express";
import organizationRoutes from "./organization.routes.js";
import locationRoutes from "./location.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import transactionRoutes from "./transaction.routes.js";
import itemRoutes from "./item.routes.js";
import customerRoutes from "./customer.routes.js";
import orderRoutes from "./order.routes.js";
import stockRequestRoutes from "./stockRequest.routes.js";

const router = express.Router();

router.use("/organization", organizationRoutes);
router.use("/location", locationRoutes);
router.use("/inventory", inventoryRoutes);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);

router.use("/item", itemRoutes);
router.use("/customer", customerRoutes);
router.use("/order", orderRoutes);
router.use("/stock-requests", stockRequestRoutes);

export default router;
