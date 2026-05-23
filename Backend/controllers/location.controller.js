import Location from '../models/location.model.js';

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
