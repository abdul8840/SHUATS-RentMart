import express from 'express';
import {
  createReview,
  getUserReviews,
  canReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/user/:userId', protect, getUserReviews);
router.get('/can-review/:requestId', protect, canReview);

export default router;