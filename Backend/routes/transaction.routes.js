import express from 'express';
import {
  createSale,
  confirmSale,
  createTransfer,
  createRestock,
  createDump,
  getAllTransactions,
  getTransactionHistory,
  getTransactionById
} from '../controllers/transaction.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial transaction management (Sale, Transfer, Restock, Dump) with Stripe integration
 */

router.post('/sale', protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), createSale);
router.post('/sale/:id/confirm', protect, authorize('Admin', 'WarehouseOwner', 'StoreManager'), confirmSale);
router.post('/transfer', protect, authorize('Admin', 'WarehouseOwner'), createTransfer);
router.post('/restock', protect, authorize('Admin', 'WarehouseOwner'), createRestock);
router.post('/dump', protect, authorize('Admin', 'WarehouseOwner'), createDump);
router.get('/', protect, getAllTransactions);
router.get('/history', protect, getTransactionHistory);
router.get('/:id', protect, getTransactionById);

export default router;
