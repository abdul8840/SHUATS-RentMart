import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  reportedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  },
  reportType: {
    type: String,
    enum: ['user', 'item', 'forum_post'],
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Report reason is required'],
    enum: [
      'Spam',
      'Fake Listing',
      'Inappropriate Content',
      'Fraud',
      'Harassment',
      'Duplicate',
      'Wrong Category',
      'Other'
    ]
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNote: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
export default Report;