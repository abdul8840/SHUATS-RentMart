import Review from '../models/Review.js';
import Request from '../models/Request.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { calculateTrustScore } from '../utils/trustScore.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed transactions' });
    }

    // Determine reviewee
    const isRequester = request.requester.toString() === req.user._id.toString();
    const isSeller = request.seller.toString() === req.user._id.toString();

    if (!isRequester && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not part of this transaction' });
    }

    const revieweeId = isRequester ? request.seller : request.requester;

    // Check if already reviewed
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      request: requestId
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this transaction' });
    }

    // Determine review type
    let type = 'neutral';
    if (rating >= 4) type = 'positive';
    else if (rating <= 2) type = 'negative';

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      request: requestId,
      item: request.item,
      rating,
      comment,
      type
    });

    // Update reviewee stats
    const reviewee = await User.findById(revieweeId);
    if (type === 'positive') {
      reviewee.positiveReviews += 1;
    } else if (type === 'negative') {
      reviewee.negativeReviews += 1;
    }
    await reviewee.save({ validateBeforeSave: false });

    // Recalculate trust score
    await calculateTrustScore(revieweeId);

    // Notification
    await Notification.create({
      recipient: revieweeId,
      sender: req.user._id,
      type: 'new_review',
      title: 'New Review Received',
      message: `${req.user.name} left a ${type} review (${rating}/5)`,
      link: `/profile`
    });

    await review.populate('reviewer', 'name profileImage');

    res.status(201).json({ success: true, review, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a user
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name profileImage department')
      .populate('item', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewee: userId });

    // Calculate average rating
    const avgResult = await Review.aggregate([
      { $match: { reviewee: userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
    ]);

    const averageRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0;

    res.json({
      success: true,
      reviews,
      averageRating,
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

// Check if can review
export const canReview = async (req, res) => {
  try {
    const { requestId } = req.params;
    const existing = await Review.findOne({
      reviewer: req.user._id,
      request: requestId
    });

    res.json({
      success: true,
      canReview: !existing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};