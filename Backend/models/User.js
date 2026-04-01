import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\d{2}[A-Za-z]+\d{3}@(shiats|shuats)\.edu\.in$/,
      'Please provide a valid SHUATS email (e.g., 24MCA020@shiats.edu.in or 24MCA020@shuats.edu.in)'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 10
  },
  profileImage: {
    public_id: String,
    url: {
      type: String,
      default: ''
    }
  },
  idCardImage: {
    public_id: String,
    url: {
      type: String,
      required: [true, 'Student ID card image is required']
    }
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String,
    select: false
  },
  emailVerificationOTPExpire: {
    type: Date,
    select: false
  },
  emailVerificationAttempts: {
    type: Number,
    default: 0
  },
  lastOTPSentAt: {
    type: Date
  },
  forumAccess: {
    type: Boolean,
    default: false
  },
  forumAccessRequested: {
    type: Boolean,
    default: false
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  successfulTransactions: {
    type: Number,
    default: 0
  },
  totalRentals: {
    type: Number,
    default: 0
  },
  completedRentals: {
    type: Number,
    default: 0
  },
  positiveReviews: {
    type: Number,
    default: 0
  },
  negativeReviews: {
    type: Number,
    default: 0
  },
  totalReports: {
    type: Number,
    default: 0
  },
  cancellations: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRE);
  return resetToken;
};

// Generate email verification OTP (6 digits)
userSchema.methods.generateEmailVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  this.emailVerificationOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.lastOTPSentAt = Date.now();
  return otp;
};

const User = mongoose.model('User', userSchema);
export default User;