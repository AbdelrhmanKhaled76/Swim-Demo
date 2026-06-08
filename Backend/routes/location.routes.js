import express from "express";
import {
  getLocations,
  createLocation,
  getLocationDetails,
  updateLocation,
  deleteLocation,
  getLocationsByOrganization,
} from "../controllers/location.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Warehouse / Store location management
 */

/**
 * @swagger
 * /api/location:
 *   get:
 *     summary: Get all locations for the calling user's organization
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations in the organization
 *   post:
 *     summary: Create a new location (Owner only). Free tier allows 1 Warehouse + 2 Stores.
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Warehouse, Store]
 *               locationDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location created successfully
 *       403:
 *         description: Forbidden – tier limit exceeded or insufficient role
 */
router.get("/", protect, getLocations);
router.post("/", protect, authorize("Owner"), createLocation);

/**
 * @swagger
 * /api/location/organization/{organizationId}:
 *   get:
 *     summary: Get all locations for a specific organization (Owner only – own org)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 */
router.get(
  "/organization/:organizationId",
  protect,
  authorize("Owner"),
  getLocationsByOrganization,
);

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update a location (Owner only)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete a location (Owner only) – fails if stock exists
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", protect, getLocationDetails);
router.put("/:id", protect, authorize("Owner"), updateLocation);
router.delete("/:id", protect, authorize("Owner"), deleteLocation);

export default router;
