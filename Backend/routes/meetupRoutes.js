import express from 'express';
import {
  getMeetupLocations,
  getSuggestedLocations,
  useLocation
} from '../controllers/meetupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMeetupLocations);
router.get('/suggestions', protect, getSuggestedLocations);
router.put('/:id/use', protect, useLocation);

export default router;