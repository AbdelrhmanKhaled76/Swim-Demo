import Location from '../models/location.model.js';
import Inventory from '../models/inventory.model.js';
import Organization from '../models/organization.model.js';

// Tier limits
const FREE_TIER_LIMITS = { Warehouse: 1, Store: 2 };

export const getLocations = async (req, res) => {
  try {
    // Scope to the calling user's organization
    const locations = await Location.find({ organizationId: req.user.organizationID });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, type, locationDetails } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'name and type are required' });
    }
    if (!['Warehouse', 'Store'].includes(type)) {
      return res.status(400).json({ message: "type must be 'Warehouse' or 'Store'" });
    }

    // organizationId always comes from the verified JWT — not from the request body
    const organizationId = req.user.organizationID;

    const duplicate = await Location.findOne({
      organizationId,
      type,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (duplicate) {
      return res.status(400).json({
        message: `A ${type.toLowerCase()} with the name "${name.trim()}" already exists.`,
      });
    }

    // Fetch org to check tier
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Enforce free-tier location limits
    if (organization.tier === 'free') {
      const limit = FREE_TIER_LIMITS[type];
      const existing = await Location.countDocuments({ organizationId, type });
      if (existing >= limit) {
        return res.status(403).json({
          message: `Free tier allows a maximum of ${limit} ${type}(s). Please upgrade to Pro to add more.`,
          upgradeRequired: true,
          currentTier: 'free',
        });
      }
    }

    const location = await Location.create({ name, type, locationDetails, organizationId });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocationDetails = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate('organizationId');
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    // Ensure the location belongs to the calling user's org
    if (location.organizationId._id.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { name, type, locationDetails } = req.body;

    const existing = await Location.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Location not found' });
    }
    if (existing.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (name) {
      const duplicate = await Location.findOne({
        organizationId: existing.organizationId,
        type: type || existing.type,
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (duplicate) {
        return res.status(400).json({
          message: `A ${(type || existing.type).toLowerCase()} with the name "${name.trim()}" already exists.`,
        });
      }
    }

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, type, locationDetails },
      { new: true, runValidators: true }
    ).populate('organizationId');

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const locationId = req.params.id;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    if (location.organizationId.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const inventoryWithStock = await Inventory.findOne({
      locationId,
      quantity: { $gt: 0 },
    });

    if (inventoryWithStock) {
      return res.status(400).json({
        message: 'Cannot delete location. Inventory is not empty. Please transfer or remove all stock first.',
      });
    }

    await Inventory.deleteMany({ locationId });
    await Location.findByIdAndDelete(locationId);
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocationsByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (organizationId !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let query = { organizationId: organizationId };

    if (req.user.role === 'StoreManager') {
      query._id = req.user.assignedLocation;
    }

    const locations = await Location.find(query);
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
