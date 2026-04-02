import mongoose from 'mongoose';

const forumRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for forum access is required'],
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  adminNote: String
}, {
  timestamps: true
});

const ForumRequest = mongoose.model('ForumRequest', forumRequestSchema);
export default ForumRequest;