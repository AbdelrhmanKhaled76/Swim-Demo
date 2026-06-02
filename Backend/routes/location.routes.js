import express from 'express';
import {
  getLocations,
  createLocation,
  getLocationDetails,
  updateLocation,
  deleteLocation,
} from '../controllers/location.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

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
 *     summary: Get all locations
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *   post:
 *     summary: Create a new location (Admin or WarehouseOwner)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLocationRequest'
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       403:
 *         description: Forbidden – Admin or WarehouseOwner required
 */
router.get('/', protect, getLocations);
router.post('/', protect, authorize('Admin', 'WarehouseOwner'), createLocation);

/**
 * @swagger
 * /api/location/{id}:
 *   get:
 *     summary: Get a location by ID (with organization populated)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Location found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *   put:
 *     summary: Update a location (Admin or WarehouseOwner)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Warehouse, Store]
 *               locationDetails:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated
 *       404:
 *         description: Location not found
 *   delete:
 *     summary: Delete a location (Admin only) – fails if stock exists
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *       400:
 *         description: Cannot delete – inventory is not empty
 *       404:
 *         description: Location not found
 */
router.get('/:id', protect, getLocationDetails);
router.put('/:id', protect, authorize('Admin', 'WarehouseOwner'), updateLocation);
router.delete('/:id', protect, authorize('Admin'), deleteLocation);

export default router;
