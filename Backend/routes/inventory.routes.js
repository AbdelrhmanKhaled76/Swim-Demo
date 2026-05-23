import express from 'express';
import { getInventories } from '../controllers/inventory.controller.js';

const router = express.Router();

router.get('/', getInventories);

export default router;
