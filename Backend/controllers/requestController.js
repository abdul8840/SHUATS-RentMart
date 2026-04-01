import Request from '../models/Request.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { calculateTrustScore } from '../utils/trustScore.js';
import { sendEmail } from '../config/email.js';
import { getNewRequestEmail } from '../utils/emailTemplates.js';

// Create a request (rent/buy)
export const createRequest = async (req, res) => {
  try {
    const { itemId, requestType, message, rentalStartDate, rentalEndDate, meetupLocation, meetupDate } = req.body;

    const item = await Item.findById(itemId).populate('seller', 'name email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (!item.isAvailable || item.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Item is not available' });
    }

    if (item.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request your own item' });
    }

    // Check if already requested
    const existingRequest = await Request.findOne({
      item: itemId,
      requester: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending/active request for this item' });
    }

    const requestData = {
      item: itemId,
      requester: req.user._id,
      seller: item.seller._id,
      requestType,
      message,
      meetupLocation,
      meetupDate
    };

    if (requestType === 'rent' && rentalStartDate && rentalEndDate) {
      requestData.rentalStartDate = rentalStartDate;
      requestData.rentalEndDate = rentalEndDate;
    }

    const request = await Request.create(requestData);
    await request.populate([
      { path: 'requester', select: 'name department profileImage' },
      { path: 'item', select: 'title images price listingType' }
    ]);

    // Create notification for seller
    await Notification.create({
      recipient: item.seller._id,
      sender: req.user._id,
      type: 'new_request',
      title: 'New Request Received',
      message: `${req.user.name} sent a ${requestType} request for "${item.title}"`,
      link: `/requests/${request._id}`
    });

    // Send email to seller
    try {
      await sendEmail({
        to: item.seller.email,
        subject: `New ${requestType} request for ${item.title}`,
        html: getNewRequestEmail(item.seller.name, item.title, req.user.name)
      });
    } catch (e) {
      console.error('Request email failed:', e.message);
    }

    // Emit socket event
    if (req.io) {
      req.io.emit('new_request', {
        recipientId: item.seller._id.toString(),
        request
      });
    }

    res.status(201).json({ success: true, request, message: 'Request sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get requests received (seller)
export const getReceivedRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { seller: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .populate('requester', 'name department semester profileImage trustScore')
      .populate('item', 'title images price listingType category')
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

// Get requests sent (requester)
export const getSentRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { requester: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .populate('seller', 'name department profileImage trustScore')
      .populate('item', 'title images price listingType category')
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

// Accept request
export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is no longer pending' });
    }

    request.status = 'accepted';
    await request.save();

    // Notification
    await Notification.create({
      recipient: request.requester,
      sender: req.user._id,
      type: 'request_accepted',
      title: 'Request Accepted',
      message: `Your request has been accepted!`,
      link: `/requests/${request._id}`
    });

    if (req.io) {
      req.io.emit('request_update', {
        recipientId: request.requester.toString(),
        request
      });
    }

    res.json({ success: true, request, message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject request
export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    request.status = 'rejected';
    await request.save();

    await Notification.create({
      recipient: request.requester,
      sender: req.user._id,
      type: 'request_rejected',
      title: 'Request Declined',
      message: `Your request has been declined.`,
      link: `/requests/${request._id}`
    });

    res.json({ success: true, request, message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete transaction
export const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.seller.toString() !== req.user._id.toString() && request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Request must be accepted before completing' });
    }

    request.status = 'completed';
    request.isCompleted = true;
    request.completedAt = Date.now();
    await request.save();

    // Update item status
    const item = await Item.findById(request.item);
    if (item) {
      if (request.requestType === 'buy') {
        item.status = 'sold';
        item.isAvailable = false;
      } else {
        item.status = 'rented';
      }
      await item.save();
    }

    // Update user stats
    const seller = await User.findById(request.seller);
    const buyer = await User.findById(request.requester);

    if (seller) {
      seller.totalTransactions += 1;
      seller.successfulTransactions += 1;
      if (request.requestType === 'rent') {
        seller.totalRentals += 1;
        seller.completedRentals += 1;
      }
      await seller.save({ validateBeforeSave: false });
      await calculateTrustScore(seller._id);
    }

    if (buyer) {
      buyer.totalTransactions += 1;
      buyer.successfulTransactions += 1;
      if (request.requestType === 'rent') {
        buyer.totalRentals += 1;
        buyer.completedRentals += 1;
      }
      await buyer.save({ validateBeforeSave: false });
      await calculateTrustScore(buyer._id);
    }

    // Notifications
    const notifRecipient = request.seller.toString() === req.user._id.toString()
      ? request.requester
      : request.seller;

    await Notification.create({
      recipient: notifRecipient,
      sender: req.user._id,
      type: 'request_completed',
      title: 'Transaction Completed',
      message: 'The transaction has been marked as completed. Please leave a review!',
      link: `/requests/${request._id}`
    });

    res.json({ success: true, request, message: 'Transaction completed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel request
export const cancelRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.seller.toString() !== req.user._id.toString() && request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['completed', 'cancelled'].includes(request.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this request' });
    }

    request.status = 'cancelled';
    request.cancelledBy = req.user._id;
    request.cancelReason = reason || '';
    await request.save();

    // Update cancellation count
    const user = await User.findById(req.user._id);
    user.cancellations += 1;
    await user.save({ validateBeforeSave: false });
    await calculateTrustScore(req.user._id);

    res.json({ success: true, request, message: 'Request cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single request
export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name department semester profileImage trustScore')
      .populate('seller', 'name department semester profileImage trustScore')
      .populate('item', 'title images price listingType category condition');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.seller._id.toString() !== req.user._id.toString() &&
        request.requester._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};