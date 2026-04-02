import express from 'express';
import {
  requestForumAccess,
  createForumPost,
  getForumPosts,
  getForumPost,
  updateForumPost,
  deleteForumPost,
  toggleLikePost,
  addComment,
  deleteComment,
  getMyForumPosts
} from '../controllers/forumController.js';
import { protect, authorizeForum } from '../middleware/auth.js';

const router = express.Router();

router.post('/request-access', protect, requestForumAccess);
router.post('/', protect, authorizeForum, createForumPost);
router.get('/', protect, getForumPosts);
router.get('/my-posts', protect, getMyForumPosts);
router.get('/:id', protect, getForumPost);
router.put('/:id', protect, authorizeForum, updateForumPost);
router.delete('/:id', protect, authorizeForum, deleteForumPost);
router.put('/:id/like', protect, toggleLikePost);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;