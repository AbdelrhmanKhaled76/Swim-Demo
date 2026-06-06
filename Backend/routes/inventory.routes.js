import express from 'express';
import {
  getStoreInventory,
  addInventory,
  checkItemAvailability,
  updateStock,
  transferStock,
  getLowStockReport,
} from '../controllers/inventory.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management per location
 */

/**
 * @swagger
 * /api/inventory/{locationId}:
 *   get:
 *     summary: Get all inventory items for a specific location
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Location MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Inventory list for the location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   $ref: '#/components/schemas/Location'
 *                 inventory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *                 totalItems:
 *                   type: number
 *       404:
 *         description: Location not found
 *   post:
 *     summary: Add initial inventory for an item at a location (Admin / WarehouseOwner / StoreManager)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, quantity]
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: Item MongoDB ObjectId
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Inventory record created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Missing/invalid fields
 *       404:
 *         description: Location not found
 *       409:
 *         description: Inventory record already exists – use updateStock instead
 */
router.get('/:locationId', /* protect, */ getStoreInventory);
router.post('/:locationId', /* protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), */ addInventory);

/**
 * @swagger
 * /api/inventory/{locationId}/check/{itemId}:
 *   get:
 *     summary: Check item availability at a location (also shows cross-location stock when low)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability info for current and other locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentLocation:
 *                   type: object
 *                   properties:
 *                     location:
 *                       $ref: '#/components/schemas/Location'
 *                     quantity:
 *                       type: number
 *                     available:
 *                       type: boolean
 *                     lowStock:
 *                       type: boolean
 *                 otherLocations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         $ref: '#/components/schemas/Location'
 *                       quantity:
 *                         type: number
 *       404:
 *         description: Location not found
 */
router.get('/:locationId/check/:itemId', /* protect, */ checkItemAvailability);

/**
 * @swagger
 * /api/inventory/{locationId}/low-stock:
 *   get:
 *     summary: Get low-stock report for a location
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Quantity threshold below which items are considered low-stock
 *     responses:
 *       200:
 *         description: Low-stock items report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   $ref: '#/components/schemas/Location'
 *                 threshold:
 *                   type: number
 *                 lowStockItems:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *                 totalLowStockItems:
 *                   type: number
 *       404:
 *         description: Location not found
 */
router.get('/:locationId/low-stock', /* protect, */ getLowStockReport);

/**
 * @swagger
 * /api/inventory/{locationId}/stock:
 *   put:
 *     summary: Manually update stock quantity for an item at a location (Admin / WarehouseOwner / StoreManager)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, quantity]
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Location or inventory record not found
 */
router.put('/:locationId/stock', /* protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), */ updateStock);

/**
 * @swagger
 * /api/inventory/{locationId}/transfer:
 *   post:
 *     summary: Transfer stock from another location to this one (Admin / WarehouseOwner / StoreManager)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromLocationId, itemId, quantity]
 *             properties:
 *               fromLocationId:
 *                 type: string
 *                 description: Source location ID
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Stock transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transfer:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: object
 *                     to:
 *                       type: object
 *                     itemId:
 *                       type: string
 *                     quantityTransferred:
 *                       type: number
 *       400:
 *         description: Insufficient stock or same source/destination
 *       404:
 *         description: Source or destination location not found
 */
router.post('/:locationId/transfer', /* protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), */ transferStock);

export default router;
