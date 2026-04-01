import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { generateToken } from '../utils/helpers.js';
import {
  validateRegistration,
  validateSHUATSEmail,
  validateOTP
} from '../utils/validators.js';
import { uploadBase64ToCloudinary } from '../config/cloudinary.js';
import { sendEmail } from '../config/email.js';
import {
  getWelcomeEmail,
  getResetPasswordEmail,
  getEmailVerificationOTP,
  getEmailVerifiedSuccess
} from '../utils/emailTemplates.js';
import crypto from 'crypto';

// ─── REGISTER ───
export const register = async (req, res) => {
  try {
    const { name, email, password, department, semester, idCardImage } = req.body;

    // Validate input
    const errors = validateRegistration({
      name, email, password, department, semester
    });
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(', ') });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // If exists but email NOT verified → allow re-registration
      if (!existingUser.isEmailVerified) {
        // Rate limit: 60 s between OTP sends
        if (existingUser.lastOTPSentAt) {
          const elapsed =
            Date.now() - new Date(existingUser.lastOTPSentAt).getTime();
          if (elapsed < 60 * 1000) {
            const wait = Math.ceil((60 * 1000 - elapsed) / 1000);
            return res.status(429).json({
              success: false,
              message: `Please wait ${wait} seconds before requesting a new OTP`,
              requiresVerification: true,
              email: existingUser.email
            });
          }
        }

        // Update unverified user data
        existingUser.name = name;
        existingUser.password = password;
        existingUser.department = department;
        existingUser.semester = parseInt(semester);

        if (idCardImage) {
          const idCardResult = await uploadBase64ToCloudinary(
            idCardImage,
            'id-cards'
          );
          existingUser.idCardImage = {
            public_id: idCardResult.public_id,
            url: idCardResult.url
          };
        }

        // Generate new OTP
        const otp = existingUser.generateEmailVerificationOTP();
        existingUser.emailVerificationAttempts = 0;
        await existingUser.save();

        // Send OTP email
        try {
          await sendEmail({
            to: existingUser.email,
            subject: 'SHUATS RentMart - Verify Your Email',
            html: getEmailVerificationOTP(existingUser.name, otp)
          });
        } catch (emailErr) {
          console.error('OTP email failed:', emailErr.message);
          return res.status(500).json({
            success: false,
            message: 'Failed to send verification email. Please try again.'
          });
        }

        return res.status(200).json({
          success: true,
          message:
            'Verification OTP sent to your email. Please verify to complete registration.',
          requiresVerification: true,
          email: existingUser.email
        });
      }

      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Require ID card
    if (!idCardImage) {
      return res.status(400).json({
        success: false,
        message: 'Student ID card image is required'
      });
    }

    const idCardResult = await uploadBase64ToCloudinary(idCardImage, 'id-cards');

    // Create user (unverified)
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
      accountStatus: 'pending',
      isEmailVerified: false
    });

    // Generate OTP
    const otp = user.generateEmailVerificationOTP();
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - Verify Your Email',
        html: getEmailVerificationOTP(user.name, otp)
      });
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
      return res.status(500).json({
        success: false,
        message:
          'Account created but failed to send verification email. Please use "Resend OTP".',
        requiresVerification: true,
        email: user.email
      });
    }

    res.status(201).json({
      success: true,
      message:
        'Registration initiated! Please verify your email with the OTP sent to your inbox.',
      requiresVerification: true,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── VERIFY EMAIL OTP ───
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and OTP are required' });
    }

    // Validate OTP format
    const otpError = validateOTP(otp);
    if (otpError) {
      return res.status(400).json({ success: false, message: otpError });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+emailVerificationOTP +emailVerificationOTPExpire'
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'No account found with this email' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
        alreadyVerified: true
      });
    }

    // Max 5 attempts
    if (user.emailVerificationAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Check OTP exists
    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpire) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check expiry
    if (user.emailVerificationOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        expired: true
      });
    }

    // Compare hashed OTP
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    if (hashedOTP !== user.emailVerificationOTP) {
      user.emailVerificationAttempts += 1;
      await user.save({ validateBeforeSave: false });

      const remaining = 5 - user.emailVerificationAttempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
        remainingAttempts: remaining
      });
    }

    // ✅ OTP valid → verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpire = undefined;
    user.emailVerificationAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Send success email
    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - Email Verified Successfully!',
        html: getEmailVerifiedSuccess(user.name)
      });
    } catch (emailErr) {
      console.error('Verification success email failed:', emailErr.message);
    }

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

    res.json({
      success: true,
      message:
        'Email verified successfully! Your account is now pending admin approval.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESEND OTP ───
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'No account found with this email' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
        alreadyVerified: true
      });
    }

    // Rate limit: 60 s
    if (user.lastOTPSentAt) {
      const elapsed =
        Date.now() - new Date(user.lastOTPSentAt).getTime();
      if (elapsed < 60 * 1000) {
        const wait = Math.ceil((60 * 1000 - elapsed) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${wait} seconds before requesting a new OTP`,
          retryAfter: wait
        });
      }
    }

    // Generate new OTP & reset attempts
    const otp = user.generateEmailVerificationOTP();
    user.emailVerificationAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Send OTP
    try {
      await sendEmail({
        to: user.email,
        subject: 'SHUATS RentMart - New Verification OTP',
        html: getEmailVerificationOTP(user.name, otp)
      });
    } catch (emailErr) {
      console.error('Resend OTP email failed:', emailErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'New OTP sent to your email. Valid for 10 minutes.'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── LOGIN ───
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    // Admin login
    if (email === process.env.ADMIN_EMAIL) {
      const admin = await User.findOne({ email, role: 'admin' }).select(
        '+password'
      );
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
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
        message:
          'Only SHUATS email IDs are allowed (e.g., 24MCA020@shiats.edu.in or 24MCA020@shuats.edu.in)'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
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
        accountStatus: user.accountStatus,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ME ───
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
        isEmailVerified: user.isEmailVerified,
        totalTransactions: user.totalTransactions,
        successfulTransactions: user.successfulTransactions,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CHECK ACCOUNT STATUS ───
export const checkAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      accountStatus: user.accountStatus,
      isEmailVerified: user.isEmailVerified,
      rejectionReason: user.rejectionReason
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── FORGOT PASSWORD ───
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'No account found with this email' });
    }

    // Must verify email first
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first before resetting password',
        requiresVerification: true,
        email: user.email
      });
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

// ─── RESET PASSWORD ───
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

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

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
      message:
        'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CHANGE PASSWORD ───
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