import StockRequest from '../models/stockRequest.model.js';
import Inventory from '../models/inventory.model.js';
import Location from '../models/location.model.js';
import Transaction from '../models/transaction.model.js';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stock-requests
// StoreManager creates a new restock request from a warehouse
// ─────────────────────────────────────────────────────────────────────────────
export const createStockRequest = async (req, res) => {
  try {
    const { storeId, warehouseId, items, notes } = req.body;

    if (!storeId || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({
        message: 'storeId, warehouseId, and at least one item are required',
      });
    }

    // Validate that the store belongs to the calling user's org
    const store = await Location.findById(storeId);
    if (!store || store.type !== 'Store') {
      return res.status(404).json({ message: 'Store not found' });
    }
    if (store.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied: store does not belong to your organization' });
    }

    // Validate warehouse
    const warehouse = await Location.findById(warehouseId);
    if (!warehouse || warehouse.type !== 'Warehouse') {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    if (warehouse.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied: warehouse does not belong to your organization' });
    }

    const stockRequest = await StockRequest.create({
      storeId,
      warehouseId,
      requestedBy: req.user._id,
      organizationId: req.user.organizationID,
      items,
      notes: notes || '',
      status: 'pending',
    });

    const populated = await stockRequest.populate([
      { path: 'storeId', select: 'name type' },
      { path: 'warehouseId', select: 'name type' },
      { path: 'requestedBy', select: 'fullName email' },
      { path: 'items.itemId', select: 'name category price' },
    ]);

    res.status(201).json({
      success: true,
      data: populated,
      message: 'Stock request submitted successfully. Awaiting admin approval.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stock-requests
// Admin: see all requests for their org (optionally filter by status)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllStockRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { organizationId: req.user.organizationID };

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const requests = await StockRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('storeId', 'name type')
      .populate('warehouseId', 'name type')
      .populate('requestedBy', 'fullName email')
      .populate('resolvedBy', 'fullName email')
      .populate('items.itemId', 'name category price');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stock-requests/my
// StoreManager: see their own requests
// ─────────────────────────────────────────────────────────────────────────────
export const getMyStockRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {
      requestedBy: req.user._id,
      organizationId: req.user.organizationID,
    };

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const requests = await StockRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('storeId', 'name type')
      .populate('warehouseId', 'name type')
      .populate('resolvedBy', 'fullName email')
      .populate('items.itemId', 'name category price');

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/stock-requests/:id
// Get a single stock request by ID (Admin or the requesting StoreManager)
// ─────────────────────────────────────────────────────────────────────────────
export const getStockRequestById = async (req, res) => {
  try {
    const stockRequest = await StockRequest.findById(req.params.id)
      .populate('storeId', 'name type')
      .populate('warehouseId', 'name type')
      .populate('requestedBy', 'fullName email')
      .populate('resolvedBy', 'fullName email')
      .populate('items.itemId', 'name category price');

    if (!stockRequest) {
      return res.status(404).json({ message: 'Stock request not found' });
    }

    // Access control: same org only
    if (stockRequest.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // StoreManagers can only see their own requests
    if (
      req.user.role === 'StoreManager' &&
      stockRequest.requestedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: stockRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/stock-requests/:id/approve
// Admin approves the request → transfers stock from warehouse to store
//   and records a 'transfer' Transaction
// ─────────────────────────────────────────────────────────────────────────────
export const approveStockRequest = async (req, res) => {
  try {
    const stockRequest = await StockRequest.findById(req.params.id);
    if (!stockRequest) {
      return res.status(404).json({ message: 'Stock request not found' });
    }
    if (stockRequest.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (stockRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Stock request is already '${stockRequest.status}' and cannot be approved`,
      });
    }

    const { adminNote, approvedQuantity } = req.body;

    if (approvedQuantity !== undefined) {
      const parsedQty = parseInt(approvedQuantity);
      if (isNaN(parsedQty) || parsedQty < 1) {
        return res.status(400).json({ message: 'approvedQuantity must be a positive integer >= 1' });
      }
      if (stockRequest.items[0]) {
        stockRequest.items[0].quantity = parsedQty;
        stockRequest.markModified('items');
      }
    }

    // Verify warehouse has enough stock for all items
    const insufficientItems = [];
    for (const reqItem of stockRequest.items) {
      const warehouseInv = await Inventory.findOne({
        locationId: stockRequest.warehouseId,
        itemId: reqItem.itemId,
      });
      if (!warehouseInv || warehouseInv.quantity < reqItem.quantity) {
        insufficientItems.push({
          itemId: reqItem.itemId,
          requested: reqItem.quantity,
          available: warehouseInv ? warehouseInv.quantity : 0,
        });
      }
    }

    if (insufficientItems.length > 0) {
      return res.status(400).json({
        message: 'Insufficient warehouse stock for one or more items',
        insufficientItems,
      });
    }

    // Transfer stock: warehouse → store for each item
    const transactionItems = [];
    for (const reqItem of stockRequest.items) {
      // Deduct from warehouse
      const updatedWarehouseInv = await Inventory.findOneAndUpdate(
        { locationId: stockRequest.warehouseId, itemId: reqItem.itemId },
        { $inc: { quantity: -reqItem.quantity } },
        { new: true }
      );
      if (updatedWarehouseInv && updatedWarehouseInv.quantity <= 0) {
        await Inventory.deleteOne({ _id: updatedWarehouseInv._id });
      }

      // Add to store (upsert)
      await Inventory.findOneAndUpdate(
        { locationId: stockRequest.storeId, itemId: reqItem.itemId },
        { $inc: { quantity: reqItem.quantity } },
        { upsert: true }
      );

      transactionItems.push({
        itemId: reqItem.itemId.toString(),
        name: '',          // populated from item model if needed
        quantity: reqItem.quantity,
        unitPrice: 0,
      });
    }

    // Create a 'transfer' Transaction record
    await Transaction.create({
      type: 'transfer',
      status: 'completed',
      fromLocationId: stockRequest.warehouseId,
      toLocationId: stockRequest.storeId,
      userId: req.user._id,
      organizationId: req.user.organizationID,
      items: transactionItems,
      notes: `Stock request approved. Request ID: ${stockRequest._id}`,
      metadata: { stockRequestId: stockRequest._id.toString() },
    });

    // Update the request
    stockRequest.status = 'approved';
    stockRequest.resolvedBy = req.user._id;
    stockRequest.resolvedAt = new Date();
    stockRequest.adminNote = req.body.adminNote || '';
    await stockRequest.save();

    const populated = await StockRequest.findById(stockRequest._id)
      .populate('storeId', 'name type')
      .populate('warehouseId', 'name type')
      .populate('requestedBy', 'fullName email')
      .populate('resolvedBy', 'fullName email')
      .populate('items.itemId', 'name category price');

    res.status(200).json({
      success: true,
      data: populated,
      message: 'Stock request approved. Inventory transferred and transaction recorded.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/stock-requests/:id/reject
// Admin rejects the request with an optional note
// ─────────────────────────────────────────────────────────────────────────────
export const rejectStockRequest = async (req, res) => {
  try {
    const stockRequest = await StockRequest.findById(req.params.id);
    if (!stockRequest) {
      return res.status(404).json({ message: 'Stock request not found' });
    }
    if (stockRequest.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (stockRequest.status !== 'pending') {
      return res.status(400).json({
        message: `Stock request is already '${stockRequest.status}' and cannot be rejected`,
      });
    }

    stockRequest.status = 'rejected';
    stockRequest.resolvedBy = req.user._id;
    stockRequest.resolvedAt = new Date();
    stockRequest.adminNote = req.body.adminNote || '';
    await stockRequest.save();

    const populated = await StockRequest.findById(stockRequest._id)
      .populate('storeId', 'name type')
      .populate('warehouseId', 'name type')
      .populate('requestedBy', 'fullName email')
      .populate('resolvedBy', 'fullName email')
      .populate('items.itemId', 'name category price');

    res.status(200).json({
      success: true,
      data: populated,
      message: 'Stock request rejected.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
