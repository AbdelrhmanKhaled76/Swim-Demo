import express from 'express';
import { register,login,forgotPassword , resetPassword } from '../controllers/auth.controller.js';


const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/forgotpassword',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
export default router;