import Stripe from 'stripe';
import Transaction from '../models/transaction.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *       properties:
 *         itemId:
 *           type: string
 *           description: ID of the item
 *         name:
 *           type: string
 *           description: Name of the item
 *         quantity:
 *           type: number
 *           description: Quantity of the item
 *         unitPrice:
 *           type: number
 *           description: Price per unit in cents
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [sale, transfer, restock, dump]
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         stripePaymentIntentId:
 *           type: string
 *         stripeRefundId:
 *           type: string
 *         userId:
 *           type: string
 *         locationId:
 *           type: string
 *         fromLocationId:
 *           type: string
 *         toLocationId:
 *           type: string
 *         relatedOrderId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TransactionItem'
 *         notes:
 *           type: string
 *         metadata:
 *           type: object
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /api/transactions/sale:
 *   post:
 *     summary: Create a sale transaction and a corresponding Stripe PaymentIntent
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in cents
 *               currency:
 *                 type: string
 *                 default: usd
 *               userId:
 *                 type: string
 *               locationId:
 *                 type: string
 *               relatedOrderId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransactionItem'
 *               notes:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Sale transaction created and payment intent ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *                     clientSecret:
 *                       type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const createSale = async (req, res, next) => {
  try {
    const { amount, currency, locationId, relatedOrderId, items, notes, metadata } = req.body;
    // userId is taken from the verified JWT token — cannot be spoofed from the request body
    const userId = req.user._id;
    const organizationId = req.user.organizationID;

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 0,
      currency: currency || 'usd',
      metadata: {
        userId: userId.toString(),
        locationId: locationId || '',
        relatedOrderId: relatedOrderId || ''
      }
    });

    // Save transaction to DB
    const transaction = await Transaction.create({
      type: 'sale',
      status: 'pending',
      amount: amount || 0,
      currency: currency || 'usd',
      stripePaymentIntentId: paymentIntent.id,
      userId,
      organizationId,
      locationId: locationId || null,
      relatedOrderId: relatedOrderId || null,
      items: items || [],
      notes: notes || '',
      metadata: metadata || {}
    });

    return res.status(201).json({
      success: true,
      data: {
        transaction,
        clientSecret: paymentIntent.client_secret
      },
      message: 'Sale transaction created, Stripe PaymentIntent ready'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @swagger
 * /api/transactions/sale/{id}/confirm:
 *   post:
 *     summary: Confirm a sale transaction after successful payment
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transaction ID
 *     responses:
 *       200:
 *         description: Sale transaction confirmed and completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
export const confirmSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    transaction.status = 'completed';
    await transaction.save();

    return res.status(200).json({
      success: true,
      data: transaction,
      message: 'Sale transaction completed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Create a transfer transaction between locations
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromLocationId
 *               - toLocationId
 *             properties:
 *               fromLocationId:
 *                 type: string
 *               toLocationId:
 *                 type: string
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransactionItem'
 *               notes:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Transfer transaction recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const createTransfer = async (req, res, next) => {
  try {
    const { fromLocationId, toLocationId, items, notes, metadata } = req.body;
    const userId = req.user._id;
    const organizationId = req.user.organizationID;

    const transaction = await Transaction.create({
      type: 'transfer',
      status: 'completed',
      fromLocationId: fromLocationId || null,
      toLocationId: toLocationId || null,
      items: items || [],
      userId,
      organizationId,
      notes: notes || '',
      metadata: metadata || {}
    });

    return res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transfer transaction completed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/restock:
 *   post:
 *     summary: Create a restock transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *             properties:
 *               locationId:
 *                 type: string
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransactionItem'
 *               notes:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Restock transaction recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const createRestock = async (req, res, next) => {
  try {
    const { locationId, items, notes, metadata } = req.body;
    const userId = req.user._id;
    const organizationId = req.user.organizationID;

    const transaction = await Transaction.create({
      type: 'restock',
      status: 'completed',
      locationId: locationId || null,
      items: items || [],
      userId,
      organizationId,
      notes: notes || '',
      metadata: metadata || {}
    });

    return res.status(201).json({
      success: true,
      data: transaction,
      message: 'Restock transaction completed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/dump:
 *   post:
 *     summary: Create a dump or refund transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *             properties:
 *               locationId:
 *                 type: string
 *               userId:
 *                 type: string
 *               reason:
 *                 type: string
 *               stripePaymentIntentId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 description: Refund amount in cents
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransactionItem'
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dump/Refund transaction recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const createDump = async (req, res, next) => {
  try {
    const { locationId, items, notes, reason, stripePaymentIntentId, amount } = req.body;
    const userId = req.user._id;
    const organizationId = req.user.organizationID;

    let stripeRefundId = null;
    let refundIssued = false;
    const refundAmount = amount || 0;

    if (stripePaymentIntentId && refundAmount > 0) {
      const refund = await stripe.refunds.create({
        payment_intent: stripePaymentIntentId,
        amount: refundAmount
      });
      stripeRefundId = refund.id;
      refundIssued = true;
    }

    const transaction = await Transaction.create({
      type: 'dump',
      status: refundIssued ? 'refunded' : 'completed',
      amount: refundAmount,
      stripePaymentIntentId: stripePaymentIntentId || null,
      stripeRefundId: stripeRefundId,
      locationId: locationId || null,
      items: items || [],
      userId,
      organizationId,
      notes: notes || '',
      metadata: { reason: reason || '', refundIssued }
    });

    return res.status(201).json({
      success: true,
      data: transaction,
      message: refundIssued ? 'Dump transaction created and Stripe refund completed' : 'Dump transaction completed'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const getAllTransactions = async (req, res, next) => {
  try {
    // Scope to the calling user's organization
    const filter = { organizationId: req.user.organizationID };
    let transactions;
    try {
      transactions = await Transaction.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'username email name');
    } catch (populateError) {
      transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: transactions,
      message: 'All transactions retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Retrieve transaction history with dynamic filters
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter starting from date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter up to date (YYYY-MM-DD)
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *         description: Filter by location ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, sale, transfer, restock, dump]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: A list of filtered transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
export const getTransactionHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, locationId, userId, type } = req.query;
    // Always scope to calling user's organization
    const filter = { organizationId: req.user.organizationID };

    if (locationId) {
      filter.$or = [
        { locationId },
        { fromLocationId: locationId },
        { toLocationId: locationId }
      ];
    }

    if (userId) {
      filter.userId = userId;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    let transactions;
    try {
      transactions = await Transaction.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'username email name');
    } catch (populateError) {
      transactions = await Transaction.find(filter).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: transactions,
      message: 'Transaction history retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a single transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Transaction ID
 *     responses:
 *       200:
 *         description: The retrieved transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let transaction;
    try {
      transaction = await Transaction.findById(id)
        .populate('userId', 'username email name');
    } catch (populateError) {
      transaction = await Transaction.findById(id);
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
