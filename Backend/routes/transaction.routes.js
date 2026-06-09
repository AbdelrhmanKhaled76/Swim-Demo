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

router.post('/sale', protect, authorize('Owner', 'StoreManager'), createSale);
router.post('/sale/:id/confirm', protect, authorize('Owner', 'StoreManager'), confirmSale);
router.post('/transfer', protect, authorize('Owner'), createTransfer);
router.post('/restock', protect, authorize('Owner'), createRestock);
router.post('/dump', protect, authorize('Owner'), createDump);
router.get('/', protect, getAllTransactions);
router.get('/history', protect, getTransactionHistory);
router.get('/:id', protect, getTransactionById);

export default router;
