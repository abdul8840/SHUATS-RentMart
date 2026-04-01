import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestType: {
    type: String,
    enum: ['rent', 'buy'],
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  rentalStartDate: Date,
  rentalEndDate: Date,
  meetupLocation: {
    type: String,
    default: ''
  },
  meetupDate: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelReason: String
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
export default Request;