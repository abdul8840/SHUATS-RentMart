import express from 'express';
import {
  createOrGetChat,
  getMyChats,
  sendMessage,
  getMessages,
  getUnreadCount
} from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrGetChat);
router.get('/', protect, getMyChats);
router.post('/message', protect, sendMessage);
router.get('/messages/:chatId', protect, getMessages);
router.get('/unread-count', protect, getUnreadCount);

export default router;