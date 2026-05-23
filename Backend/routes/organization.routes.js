import express from 'express';
import { getOrganizations } from '../controllers/organization.controller.js';

const router = express.Router();

router.get('/', getOrganizations);

export default router;
