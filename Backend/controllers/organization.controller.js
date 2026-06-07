import Organization from '../models/organization.model.js';
import Location from '../models/location.model.js';
import User from '../models/user.model.js';

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate('ownerId', 'username email');
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate('ownerId', 'username email');
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/organization/my  — returns the calling Admin's own org with location counts
export const getMyOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.organizationID).populate('ownerId', 'username email');
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Count locations by type
    const [warehouses, stores] = await Promise.all([
      Location.countDocuments({ organizationId: organization._id, type: 'Warehouse' }),
      Location.countDocuments({ organizationId: organization._id, type: 'Store' }),
    ]);

    const FREE_LIMITS = { Warehouse: 1, Store: 2 };

    res.status(200).json({
      organization,
      locationStats: {
        warehouses: { count: warehouses, limit: organization.tier === 'free' ? FREE_LIMITS.Warehouse : 'unlimited' },
        stores:     { count: stores,     limit: organization.tier === 'free' ? FREE_LIMITS.Store     : 'unlimited' },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const organization = await Organization.create({
      name,
      ownerId: req.user._id,
    });
    res.status(201).json(organization);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Organization name '${req.body.name}' already exists, please choose a different name`,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'username email');
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Organization name '${req.body.name}' already exists, please choose a different name`,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/organization/:id/upgrade  — Admin only
// Upgrades the organization tier from 'free' → 'pro'
export const upgradeToPro = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Only the owner/admin of the org can upgrade it
    if (organization._id.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'You can only upgrade your own organization' });
    }

    if (organization.tier === 'pro') {
      return res.status(400).json({ message: 'Organization is already on the Pro tier' });
    }

    organization.tier = 'pro';
    await organization.save();

    res.status(200).json({
      success: true,
      message: 'Organization successfully upgraded to Pro tier',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/organization/:id/downgrade  — Admin only (for testing / cancellation)
export const downgradeToFree = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (organization._id.toString() !== req.user.organizationID.toString()) {
      return res.status(403).json({ message: 'You can only manage your own organization' });
    }

    // Check current location counts against free limits before allowing downgrade
    const [warehouses, stores] = await Promise.all([
      Location.countDocuments({ organizationId: organization._id, type: 'Warehouse' }),
      Location.countDocuments({ organizationId: organization._id, type: 'Store' }),
    ]);

    if (warehouses > 1 || stores > 2) {
      return res.status(400).json({
        message: `Cannot downgrade to Free tier. You have ${warehouses} warehouse(s) and ${stores} store(s). Free tier allows max 1 warehouse and 2 stores. Please delete extra locations first.`,
        current: { warehouses, stores },
        freeLimits: { warehouses: 1, stores: 2 },
      });
    }

    organization.tier = 'free';
    await organization.save();

    res.status(200).json({
      success: true,
      message: 'Organization downgraded to Free tier',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
