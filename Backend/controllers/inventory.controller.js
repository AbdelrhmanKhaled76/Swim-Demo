import Inventory from '../models/inventory.model.js';

export const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
