import express from 'express';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../controllers/organization.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', protect, getOrganizations);
router.get('/:id', protect, getOrganizationById);
router.post('/', protect, authorize('Admin'), createOrganization);
router.put('/:id', protect, authorize('Admin'), updateOrganization);
router.delete('/:id', protect, authorize('Admin'), deleteOrganization);

export default router;
