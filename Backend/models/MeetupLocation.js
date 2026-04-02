import mongoose from 'mongoose';

const meetupLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: 300
  },
  type: {
    type: String,
    enum: ['Library', 'Admin Block', 'Cafeteria', 'Department', 'Hostel Area', 'Sports Complex', 'Gate', 'Other'],
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  isSafe: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const MeetupLocation = mongoose.model('MeetupLocation', meetupLocationSchema);
export default MeetupLocation;