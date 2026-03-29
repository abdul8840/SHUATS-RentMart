import express from 'express';
import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getItemsByCategory,
  getFeaturedItems
} from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createItem);
router.get('/', protect, getItems);
router.get('/featured', protect, getFeaturedItems);
router.get('/categories', protect, getItemsByCategory);
router.get('/:id', protect, getItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

export default router;