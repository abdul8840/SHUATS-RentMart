import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import {
  getPendingRegistrations,
  approveUser,
  rejectUser,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getUserDetails,
  adminGetAllItems,
  adminRemoveItem,
  adminGetAllRequests,
  getForumRequests,
  handleForumRequest,
  adminGetForumPosts,
  handleForumPost,
  togglePinPost,
  revokeForumAccess,
  getAllReports,
  resolveReport,
  createMeetupLocation,
  updateMeetupLocation,
  deleteMeetupLocation,
  getDashboardStats
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/pending', getPendingRegistrations);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Item Management
router.get('/items', adminGetAllItems);
router.put('/items/:id/remove', adminRemoveItem);

// Request Management
router.get('/requests', adminGetAllRequests);

// Forum Management
router.get('/forum/requests', getForumRequests);
router.put('/forum/requests/:id', handleForumRequest);
router.get('/forum/posts', adminGetForumPosts);
router.put('/forum/posts/:id', handleForumPost);
router.put('/forum/posts/:id/pin', togglePinPost);
router.put('/forum/revoke/:id', revokeForumAccess);

// Report Management
router.get('/reports', getAllReports);
router.put('/reports/:id', resolveReport);

// Meetup Location Management
router.post('/meetup-locations', createMeetupLocation);
router.put('/meetup-locations/:id', updateMeetupLocation);
router.delete('/meetup-locations/:id', deleteMeetupLocation);

export default router;