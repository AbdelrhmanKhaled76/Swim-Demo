import express from 'express';
import {
  getLocations,
  createLocation,
  getLocationDetails,
  updateLocation,
  deleteLocation,
} from '../controllers/location.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', protect, getLocations);
router.post('/', protect, authorize('Admin', 'WarehouseOwner'), createLocation);
router.get('/:id', protect, getLocationDetails);
router.put('/:id', protect, authorize('Admin', 'WarehouseOwner'), updateLocation);
router.delete('/:id', protect, authorize('Admin'), deleteLocation);

export default router;
