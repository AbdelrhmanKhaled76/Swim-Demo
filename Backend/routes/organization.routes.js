import express from "express";
import {
  getOrganizations,
  getOrganizationById,
  getMyOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  upgradeToPro,
  downgradeToFree,
} from "../controllers/organization.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management
 */

/**
 * @swagger
 * /api/organization/my:
 *   get:
 *     summary: Get the calling Owner's own organization with location stats and tier info
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization details with location counts vs tier limits
 */
router.get("/my", protect, authorize("Owner"), getMyOrganization);

/**
 * @swagger
 * /api/organization:
 *   get:
 *     summary: Get all organizations (Owner only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create a new organization (Owner only — normally auto-created on register)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", protect, authorize("Owner"), getOrganizations);
router.post("/", protect, authorize("Owner"), createOrganization);

/**
 * @swagger
 * /api/organization/{id}:
 *   get:
 *     summary: Get a single organization by ID (Owner only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Update an organization (Owner only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete an organization (Owner only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", protect, authorize("Owner"), getOrganizationById);
router.put("/:id", protect, authorize("Owner"), updateOrganization);
router.delete("/:id", protect, authorize("Owner"), deleteOrganization);

/**
 * @swagger
 * /api/organization/{id}/upgrade:
 *   patch:
 *     summary: Upgrade organization from Free to Pro tier (Owner only)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization upgraded to Pro tier
 *       400:
 *         description: Already on Pro tier
 *       403:
 *         description: Can only upgrade your own organization
 *       404:
 *         description: Organization not found
 */
router.patch("/:id/upgrade", protect, authorize("Owner"), upgradeToPro);

/**
 * @swagger
 * /api/organization/{id}/downgrade:
 *   patch:
 *     summary: Downgrade organization from Pro to Free tier (Owner only). Fails if over free-tier limits.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization downgraded to Free tier
 *       400:
 *         description: Over free-tier location limits – delete extra locations first
 *       403:
 *         description: Can only manage your own organization
 */
router.patch("/:id/downgrade", protect, authorize("Owner"), downgradeToFree);

export default router;
