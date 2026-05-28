import Location from '../models/location.model.js';
import Inventory from '../models/inventory.model.js';

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLocationDetails = async (req ,res) =>{
  try{
    const location = await Location.findById(req.params.id).populate("organizationId") ;
      if(!location){
        return res.status(404).json({message:" location not found "})
      }
      res.status(200).json(location);
  }catch(error){
    res.status(500).json({message:error.message})
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { name, type, locationDetails } = req.body;
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, type, locationDetails },
      { new: true, runValidators: true }
    ).populate('organizationId');
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
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

    const inventoryWithStock = await Inventory.findOne({
      locationId: locationId,
      quantity: { $gt: 0 },
    });

    if (inventoryWithStock) {
      return res.status(400).json({
        message: 'Cannot delete location. Inventory is not empty. Please transfer or remove all stock first.',
      });
    }

    await Inventory.deleteMany({ locationId: locationId });

    await Location.findByIdAndDelete(locationId);
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
