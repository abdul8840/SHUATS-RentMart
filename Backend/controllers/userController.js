import User from '../models/User.js';
import Item from '../models/Item.js';
import Review from '../models/Review.js';
import { uploadBase64ToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { calculateTrustScore, getTrustLevel } from '../utils/trustScore.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, department, semester, profileImage } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (semester) updateData.semester = parseInt(semester);

    if (profileImage) {
      // Delete old profile image if exists
      if (req.user.profileImage && req.user.profileImage.public_id) {
        await deleteFromCloudinary(req.user.profileImage.public_id);
      }
      const result = await uploadBase64ToCloudinary(profileImage, 'profiles');
      updateData.profileImage = {
        public_id: result.public_id,
        url: result.url
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get public user profile
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'name department semester profileImage trustScore totalTransactions successfulTransactions createdAt'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const trustLevel = getTrustLevel(user.trustScore);
    const items = await Item.find({ seller: user._id, status: 'active', isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(10);

    const reviews = await Review.find({ reviewee: user._id })
      .populate('reviewer', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        trustLevel
      },
      items,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user trust score
export const getTrustScore = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const score = await calculateTrustScore(userId);
    const trustLevel = getTrustLevel(score);

    res.json({
      success: true,
      trustScore: score,
      trustLevel
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's listings
export const getMyListings = async (req, res) => {
  try {
    const { status, listingType, page = 1, limit = 10 } = req.query;
    const query = { seller: req.user._id };

    if (status) query.status = status;
    if (listingType) query.listingType = listingType;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(query)
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

// Get user dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const activeListings = await Item.countDocuments({ seller: userId, status: 'active' });
    const soldItems = await Item.countDocuments({ seller: userId, status: 'sold' });
    const rentedItems = await Item.countDocuments({ seller: userId, status: 'rented' });

    const user = await User.findById(userId);
    const trustLevel = getTrustLevel(user.trustScore);

    res.json({
      success: true,
      stats: {
        activeListings,
        soldItems,
        rentedItems,
        trustScore: user.trustScore,
        trustLevel,
        totalTransactions: user.totalTransactions,
        successfulTransactions: user.successfulTransactions,
        memberSince: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};