import express from 'express';
import {
  register,
  login,
  getMe,
  checkAccountStatus,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmailOTP,
  resendOTP
} from '../controllers/authController.js';
import { protect, softProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/check-status', softProtect, checkAccountStatus);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

export default router;