import mongoose from 'mongoose';
import Inventory from '../models/inventory.model.js';
import Location from '../models/location.model.js';
import itemModel from '../models/item.model.js';

export const getStoreInventory = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const inventory = await Inventory.find({ locationId })
      .populate('itemId')
     

    res.status(200).json({
      location: location,
      inventory: inventory,
      totalItems: inventory.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addInventory = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { itemId, quantity } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'itemId is required' });
    }
    if (quantity == null || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const existing = await Inventory.findOne({ locationId, itemId });
    if (existing) {
      return res.status(409).json({ message: 'Inventory record already exists for this item at this location. Use updateStock instead.' });
    }

    const inventory = await Inventory.create({ locationId, itemId, quantity });
    const populated = await inventory.populate(['itemId', 'locationId']);

    // Emit real-time event so all clients in this org see the new item immediately
    const io = req.app.get('socketio');
    if (io && location.organizationId) {
      io.to(`org_${location.organizationId}`).emit('inventory_item_added', {
        locationId,
        organizationId: location.organizationId,
        item: populated,
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkItemAvailability = async (req, res) => {
  try {
    const { locationId, itemId } = req.params;
    const LOW_STOCK_THRESHOLD = 5;

    const currentLocation = await Location.findById(locationId);
    if (!currentLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const currentInventory = await Inventory.findOne({
      locationId,
      itemId,
    }).populate('itemId');

    const isAvailable = currentInventory && currentInventory.quantity > 0;
    const isLowStock = currentInventory && currentInventory.quantity > 0 && currentInventory.quantity < LOW_STOCK_THRESHOLD;

    let otherLocations = [];

    if (!isAvailable || isLowStock) {
      const orgLocations = await Location.find({
        organizationId: currentLocation.organizationId,
        _id: { $ne: locationId },
      });

      const orgLocationIds = orgLocations.map((loc) => loc._id);

      const otherInventories = await Inventory.find({
        locationId: { $in: orgLocationIds },
        itemId,
        quantity: { $gt: 0 },
      })
        .populate('itemId')
        .populate('locationId');

      otherLocations = otherInventories.map((inv) => ({
        location: inv.locationId,
        quantity: inv.quantity,
      }));
    }

    res.status(200).json({
      currentLocation: {
        location: currentLocation,
        quantity: currentInventory ? currentInventory.quantity : 0,
        available: isAvailable,
        lowStock: isLowStock,
      },
      otherLocations: otherLocations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkItemAvailabilityBySearch = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query parameter q is required' });
    }

    const currentLocation = await Location.findById(locationId);
    if (!currentLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const queryConditions = [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ];

    if (mongoose.Types.ObjectId.isValid(q)) {
      queryConditions.push({ _id: q });
    }

    const matchingItems = await itemModel.find({
      isActive: true,
      $or: queryConditions,
    });

    if (matchingItems.length === 0) {
      return res.status(200).json({
        matchingItems: [],
        otherLocations: [],
      });
    }

    const itemIds = matchingItems.map((item) => item._id);

    const orgLocations = await Location.find({
      organizationId: currentLocation.organizationId,
      _id: { $ne: locationId },
    });

    const orgLocationIds = orgLocations.map((loc) => loc._id);

    const otherInventories = await Inventory.find({
      locationId: { $in: orgLocationIds },
      itemId: { $in: itemIds },
      quantity: { $gt: 0 },
    })
      .populate('itemId')
      .populate('locationId');

    const otherLocations = otherInventories.map((inv) => ({
      itemId: inv.itemId?._id,
      itemName: inv.itemId?.name,
      location: inv.locationId,
      quantity: inv.quantity,
    }));

    res.status(200).json({
      matchingItems: matchingItems.map(item => ({
        _id: item._id,
        name: item.name,
        category: item.category,
      })),
      otherLocations: otherLocations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { itemId, quantity } = req.body;

    if (quantity == null || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { locationId, itemId },
      { quantity },
      { new: true, runValidators: true }
    ).populate('itemId');

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory record not found for this item at this location. Please use addInventory first.' });
    }

    if (inventory.quantity <= 0) {
      await Inventory.deleteOne({ _id: inventory._id });
    }

    res.status(200).json({
      message: 'Stock updated successfully',
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const transferStock = async (req, res) => {
  try {
    const { locationId } = req.params; 
    const { fromLocationId, itemId, quantity } = req.body;

    if (!fromLocationId || !itemId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: 'fromLocationId, itemId, and a positive quantity are required',
      });
    }

    if (fromLocationId === locationId) {
      return res.status(400).json({
        message: 'Source and destination locations cannot be the same',
      });
    }

    const [fromLocation, toLocation] = await Promise.all([
      Location.findById(fromLocationId),
      Location.findById(locationId),
    ]);

    if (!fromLocation) {
      return res.status(404).json({ message: 'Source location not found' });
    }
    if (!toLocation) {
      return res.status(404).json({ message: 'Destination location not found' });
    }

    const sourceInventory = await Inventory.findOne({
      locationId: fromLocationId,
      itemId,
    });

    if (!sourceInventory || sourceInventory.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient stock in source location. Available: ${sourceInventory ? sourceInventory.quantity : 0}`,
      });
    }

    sourceInventory.quantity -= quantity;
    if (sourceInventory.quantity <= 0) {
      await Inventory.deleteOne({ _id: sourceInventory._id });
    } else {
      await sourceInventory.save();
    }

    const destInventory = await Inventory.findOneAndUpdate(
      { locationId, itemId },
      { $inc: { quantity: quantity } },
      { new: true, upsert: true }
    );

    // Emit real-time event so all clients in this org update both locations instantly
    const io = req.app.get('socketio');
    const orgId = fromLocation.organizationId;
    if (io && orgId) {
      io.to(`org_${orgId}`).emit('inventory_transferred', {
        organizationId: orgId,
        fromLocationId,
        toLocationId: locationId,
        itemId,
        fromQuantity: sourceInventory.quantity,
        toQuantity: destInventory.quantity,
      });
    }

    res.status(200).json({
      message: 'Stock transferred successfully',
      transfer: {
        from: {
          location: fromLocation,
          remainingQuantity: sourceInventory.quantity,
        },
        to: {
          location: toLocation,
          newQuantity: destInventory.quantity,
        },
        itemId,
        quantityTransferred: quantity,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLowStockReport = async (req, res) => {
  try {
    const { locationId } = req.params;
    const threshold = parseInt(req.query.threshold) || 5;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const lowStockItems = await Inventory.find({
      locationId,
      quantity: { $lt: threshold },
    })
      .populate('itemId')
      .populate('locationId');

    res.status(200).json({
      location,
      threshold,
      lowStockItems,
      totalLowStockItems: lowStockItems.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
