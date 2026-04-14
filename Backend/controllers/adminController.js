import User from '../models/User.js';
import Item from '../models/Item.js';
import Request from '../models/Request.js';
import ForumPost from '../models/ForumPost.js';
import ForumRequest from '../models/ForumRequest.js';
import Report from '../models/Report.js';
import MeetupLocation from '../models/MeetupLocation.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../config/email.js';
import { getAccountApprovedEmail, getAccountRejectedEmail, getForumAccessEmail } from '../utils/emailTemplates.js';

// ============ USER MANAGEMENT ============

// Get all pending registrations
export const getPendingRegistrations = async (req, res) => {
  try {
    const users = await User.find({ accountStatus: 'pending', role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve user registration
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.accountStatus = 'approved';
    await user.save({ validateBeforeSave: false });

    // Send notification
    await Notification.create({
      recipient: user._id,
      type: 'account_approved',
      title: 'Account Approved!',
      message: 'Your SHUATS RentMart account has been approved. Welcome!'
    });

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - Account Approved!',
        html: getAccountApprovedEmail(user.name)
      });
    } catch (e) {
      console.error('Approval email failed:', e.message);
    }

    res.json({ success: true, message: `User ${user.name} approved successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject user registration
export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.accountStatus = 'rejected';
    user.rejectionReason = reason || 'ID verification failed';
    await user.save({ validateBeforeSave: false });

    // Notification
    await Notification.create({
      recipient: user._id,
      type: 'account_rejected',
      title: 'Account Rejected',
      message: `Your account was rejected. Reason: ${user.rejectionReason}`
    });

    // Email
    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - Registration Update',
        html: getAccountRejectedEmail(user.name, user.rejectionReason)
      });
    } catch (e) {
      console.error('Rejection email failed:', e.message);
    }

    res.json({ success: true, message: `User ${user.name} rejected` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };

    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove user's items
    await Item.deleteMany({ seller: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single user details (admin)
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const items = await Item.find({ seller: user._id });
    const requests = await Request.find({
      $or: [{ seller: user._id }, { requester: user._id }]
    });

    res.json({ success: true, user, items, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ITEM MANAGEMENT ============

// Get all items (admin)
export const adminGetAllItems = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
      .populate('seller', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item (admin)
export const adminRemoveItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, {
      status: 'removed',
      isAvailable: false
    }, { new: true });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item removed by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ REQUEST MANAGEMENT ============

export const adminGetAllRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .populate('requester', 'name email')
      .populate('seller', 'name email')
      .populate('item', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ FORUM MANAGEMENT ============

// Get forum access requests
export const getForumRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await ForumRequest.find(query)
      .populate('user', 'name email department semester profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject forum access
export const handleForumRequest = async (req, res) => {
  try {
    const { action, adminNote } = req.body; // action: 'approve' or 'reject'

    const forumReq = await ForumRequest.findById(req.params.id).populate('user');
    if (!forumReq) {
      return res.status(404).json({ success: false, message: 'Forum request not found' });
    }

    if (action === 'approve') {
      forumReq.status = 'approved';
      await User.findByIdAndUpdate(forumReq.user._id, {
        forumAccess: true,
        forumAccessRequested: false
      });

      await Notification.create({
        recipient: forumReq.user._id,
        type: 'forum_access_granted',
        title: 'Forum Access Granted!',
        message: 'You now have access to create posts on the campus forum.'
      });
    } else {
      forumReq.status = 'rejected';
      await User.findByIdAndUpdate(forumReq.user._id, {
        forumAccessRequested: false
      });

      await Notification.create({
        recipient: forumReq.user._id,
        type: 'forum_access_denied',
        title: 'Forum Access Denied',
        message: adminNote || 'Your forum access request was denied.'
      });
    }

    forumReq.reviewedBy = req.user._id;
    forumReq.reviewedAt = Date.now();
    forumReq.adminNote = adminNote || '';
    await forumReq.save();

    // Send email
    try {
      await sendEmail({
        to: forumReq.user.email,
        subject: `SHUATS RentMart - Forum Access ${action === 'approve' ? 'Granted' : 'Denied'}`,
        html: getForumAccessEmail(forumReq.user.name, action === 'approve')
      });
    } catch (e) {
      console.error('Forum access email failed:', e.message);
    }

    res.json({ success: true, message: `Forum access ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all forum posts (admin - including pending)
export const adminGetForumPosts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await ForumPost.find(query)
      .populate('author', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ForumPost.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve/Reject forum post
export const handleForumPost = async (req, res) => {
  try {
    const { action } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.status = action === 'approve' ? 'approved' : 'rejected';
    await post.save();

    await Notification.create({
      recipient: post.author,
      type: action === 'approve' ? 'forum_post_approved' : 'forum_post_rejected',
      title: `Forum Post ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Your post "${post.title}" has been ${action}d.`
    });

    res.json({ success: true, message: `Post ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle pin forum post
export const togglePinPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({ success: true, message: `Post ${post.isPinned ? 'pinned' : 'unpinned'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Revoke forum access
export const revokeForumAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.forumAccess = false;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: `Forum access revoked for ${user.name}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ REPORT MANAGEMENT ============

export const getAllReports = async (req, res) => {
  try {
    const { status, reportType, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (reportType) query.reportType = reportType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('reportedItem', 'title')
      .populate('reportedPost', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resolve report
export const resolveReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const report = await Report.findByIdAndUpdate(req.params.id, {
      status,
      adminNote,
      resolvedBy: req.user._id,
      resolvedAt: Date.now()
    }, { new: true });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Notify reporter
    await Notification.create({
      recipient: report.reporter,
      type: 'report_resolved',
      title: 'Report Updated',
      message: `Your report has been ${status}.`
    });

    res.json({ success: true, report, message: `Report ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ MEETUP LOCATION MANAGEMENT ============

export const createMeetupLocation = async (req, res) => {
  try {
    const { name, description, type, coordinates, isSafe } = req.body;

    const location = await MeetupLocation.create({
      name,
      description,
      type,
      coordinates,
      isSafe: isSafe !== false
    });

    res.status(201).json({ success: true, location, message: 'Meetup location added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMeetupLocation = async (req, res) => {
  try {
    const location = await MeetupLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.json({ success: true, location, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMeetupLocation = async (req, res) => {
  try {
    await MeetupLocation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ANALYTICS / DASHBOARD ============

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const pendingApprovals = await User.countDocuments({ accountStatus: 'pending', role: 'student' });
    const approvedUsers = await User.countDocuments({ accountStatus: 'approved', role: 'student' });
    const rejectedUsers = await User.countDocuments({ accountStatus: 'rejected', role: 'student' });

    const totalItems = await Item.countDocuments();
    const activeItems = await Item.countDocuments({ status: 'active' });
    const soldItems = await Item.countDocuments({ status: 'sold' });
    const rentedItems = await Item.countDocuments({ status: 'rented' });

    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });

    const totalForumPosts = await ForumPost.countDocuments();
    const pendingForumPosts = await ForumPost.countDocuments({ status: 'pending' });

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    const pendingForumRequests = await ForumRequest.countDocuments({ status: 'pending' });

    // Recent registrations
    const recentUsers = await User.find({ role: 'student' })
      .select('name email department accountStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Category distribution
    const categoryStats = await Item.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Department distribution
    const departmentStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, pending: pendingApprovals, approved: approvedUsers, rejected: rejectedUsers },
        items: { total: totalItems, active: activeItems, sold: soldItems, rented: rentedItems },
        requests: { total: totalRequests, pending: pendingRequests, completed: completedRequests },
        forum: { totalPosts: totalForumPosts, pendingPosts: pendingForumPosts, pendingRequests: pendingForumRequests },
        reports: { total: totalReports, pending: pendingReports },
        recentUsers,
        categoryStats,
        departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};