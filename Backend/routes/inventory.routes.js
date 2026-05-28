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

// GET /api/inventory/:locationId — Get all items in a specific location
router.get('/:locationId', protect, getStoreInventory);

// POST /api/inventory/:locationId — Add initial inventory for an item at a location
router.post('/:locationId', protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), addInventory);

// GET /api/inventory/:locationId/check/:itemId — Check item availability (current + cross-org)
router.get('/:locationId/check/:itemId', protect, checkItemAvailability);

// GET /api/inventory/:locationId/low-stock — Get low stock report for a location
router.get('/:locationId/low-stock', protect, getLowStockReport);

// PUT /api/inventory/:locationId/stock — Manually update stock quantity
router.put('/:locationId/stock', protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), updateStock);

// POST /api/inventory/:locationId/transfer — Transfer stock from another location to this one
router.post('/:locationId/transfer', protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), transferStock);

export default router;
