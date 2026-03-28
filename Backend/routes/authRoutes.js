import express from 'express';
import {
  register,
  login,
  getMe,
  checkAccountStatus,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/authController.js';
import { protect, softProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/check-status', softProtect, checkAccountStatus);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

export default router;