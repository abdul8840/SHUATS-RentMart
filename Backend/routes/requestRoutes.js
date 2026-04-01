import express from 'express';
import {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  getRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.get('/:id', protect, getRequest);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/complete', protect, completeRequest);
router.put('/:id/cancel', protect, cancelRequest);

export default router;