import express from 'express';
import {
  createStockRequest,
  getAllStockRequests,
  getMyStockRequests,
  getStockRequestById,
  approveStockRequest,
  rejectStockRequest,
} from '../controllers/stockRequest.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: StockRequests
 *   description: StoreManager restock requests and Admin approval workflow
 */

/**
 * @swagger
 * /api/stock-requests:
 *   post:
 *     summary: Create a new stock request (StoreManager only)
 *     tags: [StockRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [storeId, warehouseId, items]
 *             properties:
 *               storeId:
 *                 type: string
 *                 description: The Store location ID
 *               warehouseId:
 *                 type: string
 *                 description: The Warehouse location ID to request from
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [itemId, quantity]
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stock request created, awaiting admin approval
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Access denied
 *   get:
 *     summary: Get all stock requests for the org (Admin only). Filter by ?status=pending|approved|rejected
 *     tags: [StockRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: List of stock requests
 */
router.post('/', protect, authorize('StoreManager'), createStockRequest);
router.get('/', protect, authorize('Admin'), getAllStockRequests);

/**
 * @swagger
 * /api/stock-requests/my:
 *   get:
 *     summary: Get my own stock requests (StoreManager). Filter by ?status=pending|approved|rejected
 *     tags: [StockRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: List of the calling user's stock requests
 */
router.get('/my', protect, authorize('StoreManager'), getMyStockRequests);

/**
 * @swagger
 * /api/stock-requests/{id}:
 *   get:
 *     summary: Get a single stock request by ID (Admin sees all, StoreManager sees own)
 *     tags: [StockRequests]
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
 *         description: Stock request found
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.get('/:id', protect, authorize('Admin', 'StoreManager'), getStockRequestById);

/**
 * @swagger
 * /api/stock-requests/{id}/approve:
 *   patch:
 *     summary: Approve a stock request (Admin only). Transfers inventory and records a Transaction.
 *     tags: [StockRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request approved, inventory transferred
 *       400:
 *         description: Already resolved or insufficient stock
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.patch('/:id/approve', protect, authorize('Admin'), approveStockRequest);

/**
 * @swagger
 * /api/stock-requests/{id}/reject:
 *   patch:
 *     summary: Reject a stock request (Admin only)
 *     tags: [StockRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNote:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: Request rejected
 *       400:
 *         description: Already resolved
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.patch('/:id/reject', protect, authorize('Admin'), rejectStockRequest);

export default router;
