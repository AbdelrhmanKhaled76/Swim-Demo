import Organization from '../models/organization.model.js';

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
      return res.status(409).json({ message: `Organization name '${req.body.name}' already exists, please choose a different name` });
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
      return res.status(409).json({ message: `Organization name '${req.body.name}' already exists, please choose a different name` });
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
