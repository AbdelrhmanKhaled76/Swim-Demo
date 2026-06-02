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

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial transaction management (Sale, Transfer, Restock, Dump) with Stripe integration
 */

router.post('/sale', createSale);
router.post('/sale/:id/confirm', confirmSale);
router.post('/transfer', createTransfer);
router.post('/restock', createRestock);
router.post('/dump', createDump);
router.get('/', getAllTransactions);
router.get('/history', getTransactionHistory);
router.get('/:id', getTransactionById);

export default router;
