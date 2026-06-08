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
 *     summary: Get all inventory items for a specific location (all roles)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *   post:
 *     summary: Add initial inventory for an item at a location (Admin / WarehouseOwner)
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
 */
router.get('/:locationId', protect, getStoreInventory);
router.post('/:locationId', protect, authorize('Owner'), addInventory);

/**
 * @swagger
 * /api/inventory/{locationId}/check/{itemId}:
 *   get:
 *     summary: Check item availability at a location (all roles)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:locationId/check/:itemId', protect, checkItemAvailability);

/**
 * @swagger
 * /api/inventory/{locationId}/low-stock:
 *   get:
 *     summary: Get low-stock report for a location (Admin / WarehouseOwner / StoreManager)
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
 */
router.get('/:locationId/low-stock', protect, getLowStockReport);

/**
 * @swagger
 * /api/inventory/{locationId}/stock:
 *   put:
 *     summary: Manually update stock quantity (Admin / WarehouseOwner)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:locationId/stock', protect, authorize('Owner'), updateStock);

/**
 * @swagger
 * /api/inventory/{locationId}/transfer:
 *   post:
 *     summary: Transfer stock between locations (Admin / WarehouseOwner)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:locationId/transfer', protect, authorize('Owner'), transferStock);

export default router;
