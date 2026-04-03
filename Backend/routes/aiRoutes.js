import express from 'express';
import {
  generateForumContent,
  generateItemDescription,
  chatWithAI
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-content', protect, generateForumContent);
router.post('/generate-description', protect, generateItemDescription);
router.post('/chat', protect, chatWithAI);

export default router;