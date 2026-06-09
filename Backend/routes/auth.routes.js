import express from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  inviteUser 
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints – register, login, password reset
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new Owner account (creates org + warehouse automatically)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, orgName, warehouse]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *               orgName:
 *                 type: string
 *               warehouse:
 *                 type: string
 *               industry:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already registered
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/forgotpassword:
 *   post:
 *     summary: Request a password-reset token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset token generated
 *       404:
 *         description: No user found with that email
 */
router.post('/forgotpassword', forgotPassword);

/**
 * @swagger
 * /api/auth/resetpassword/{resettoken}:
 *   put:
 *     summary: Reset password using the reset token
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 */
router.put('/resetpassword/:resettoken', resetPassword);

/**
 * @swagger
 * /api/auth/invite:
 *   post:
 *     summary: Owner invites a new StoreManager to their organization
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, role]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [StoreManager]
 *     responses:
 *       201:
 *         description: User invited successfully
 *       400:
 *         description: Validation error or email already registered
 *       403:
 *         description: Owner role required
 */
router.post('/createStoreManager', protect, authorize('Owner'), inviteUser);

export default router;