import Report from '../models/Report.js';
import User from '../models/User.js';
import { calculateTrustScore } from '../utils/trustScore.js';

// Create report
export const createReport = async (req, res) => {
  try {
    const { reportType, reportedUser, reportedItem, reportedPost, reason, description } = req.body;

    if (!reportType || !reason) {
      return res.status(400).json({ success: false, message: 'Report type and reason are required' });
    }

    const reportData = {
      reporter: req.user._id,
      reportType,
      reason,
      description
    };

    if (reportType === 'user' && reportedUser) {
      reportData.reportedUser = reportedUser;
    } else if (reportType === 'item' && reportedItem) {
      reportData.reportedItem = reportedItem;
    } else if (reportType === 'forum_post' && reportedPost) {
      reportData.reportedPost = reportedPost;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid report target' });
    }

    const report = await Report.create(reportData);

    // If reporting a user, increment their report count
    if (reportType === 'user' && reportedUser) {
      await User.findByIdAndUpdate(reportedUser, { $inc: { totalReports: 1 } });
      await calculateTrustScore(reportedUser);
    }

    res.status(201).json({ success: true, report, message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my reports
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate('reportedUser', 'name email')
      .populate('reportedItem', 'title')
      .populate('reportedPost', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};