import express from 'express';
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  getTrustScore,
  getMyListings,
  getDashboardStats
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/public/:userId', protect, getPublicProfile);
router.get('/trust-score/:userId?', protect, getTrustScore);
router.get('/my-listings', protect, getMyListings);
router.get('/dashboard', protect, getDashboardStats);

export default router;