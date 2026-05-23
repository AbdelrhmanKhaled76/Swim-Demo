import express from "express";
import organizationRoutes from "./organization.routes.js";
import locationRoutes from "./location.routes.js";
import inventoryRoutes from "./inventory.routes.js";

const router = express.Router();

router.use("/organizations", organizationRoutes);
router.use("/locations", locationRoutes);
router.use("/inventories", inventoryRoutes);

export default router;
