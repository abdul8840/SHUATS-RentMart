import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { generateToken } from '../utils/helpers.js';
import { validateRegistration, validateSHUATSEmail } from '../utils/validators.js';
import { uploadBase64ToCloudinary } from '../config/cloudinary.js';
import { sendEmail } from '../config/email.js';
import { getWelcomeEmail, getResetPasswordEmail } from '../utils/emailTemplates.js';
import crypto from 'crypto';

// Register Student
export const register = async (req, res) => {
  try {
    const { name, email, password, department, semester, idCardImage } = req.body;

    // Validate input
    const errors = validateRegistration({ name, email, password, department, semester });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Upload ID card image to Cloudinary
    if (!idCardImage) {
      return res.status(400).json({ success: false, message: 'Student ID card image is required' });
    }

    const idCardResult = await uploadBase64ToCloudinary(idCardImage, 'id-cards');

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      department,
      semester: parseInt(semester),
      idCardImage: {
        public_id: idCardResult.public_id,
        url: idCardResult.url
      },
      accountStatus: 'pending'
    });

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to SHUATS RentMart - Account Pending Approval',
        html: getWelcomeEmail(user.name)
      });
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval. You will be notified once approved.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check for admin login
    if (email === process.env.ADMIN_EMAIL) {
      const admin = await User.findOne({ email, role: 'admin' }).select('+password');
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      admin.lastLogin = Date.now();
      await admin.save({ validateBeforeSave: false });

      const token = generateToken(admin._id, admin.role);
      return res.json({
        success: true,
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          accountStatus: admin.accountStatus
        }
      });
    }

    // Validate SHUATS email
    if (!validateSHUATSEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Only SHUATS email IDs are allowed (e.g., 24MCA020@shiats.com or 24MCA020@shuats.com)'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check account status
    if (user.accountStatus === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval',
        accountStatus: 'pending'
      });
    }

    if (user.accountStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been rejected by the administrator',
        accountStatus: 'rejected',
        rejectionReason: user.rejectionReason
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Contact admin.'
      });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        profileImage: user.profileImage,
        trustScore: user.trustScore,
        forumAccess: user.forumAccess,
        accountStatus: user.accountStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user (check auth status)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        profileImage: user.profileImage,
        idCardImage: user.idCardImage,
        trustScore: user.trustScore,
        forumAccess: user.forumAccess,
        forumAccessRequested: user.forumAccessRequested,
        accountStatus: user.accountStatus,
        totalTransactions: user.totalTransactions,
        successfulTransactions: user.successfulTransactions,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check account status (soft protect - no approved check)
export const checkAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      accountStatus: user.accountStatus,
      rejectionReason: user.rejectionReason
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - Password Reset',
        html: getResetPasswordEmail(user.name, resetUrl)
      });

      res.json({
        success: true,
        message: 'Password reset link sent to your email'
      });
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password (logged in)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new passwords are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};