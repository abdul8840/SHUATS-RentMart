import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    required: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ reviewer: 1, request: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;