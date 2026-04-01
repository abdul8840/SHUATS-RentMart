export const getEmailVerificationOTP = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">Email Verification</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#333;margin-bottom:16px;">Verify Your Email ✉️</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:8px;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="color:#666;line-height:1.6;margin-bottom:24px;">
            Use the following OTP to verify your SHUATS email address. This code is valid for <strong>10 minutes</strong>.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <div style="display:inline-block;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px dashed #4a7c59;border-radius:16px;padding:24px 48px;">
              <p style="color:#999;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Your Verification Code</p>
              <h1 style="color:#2d5016;margin:0;font-size:40px;letter-spacing:12px;font-weight:800;">${otp}</h1>
            </div>
          </div>
          <div style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:20px;">
            <p style="color:#92400e;margin:0;font-size:13px;">
              ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. SHUATS RentMart will never ask for your OTP via phone or chat.
            </p>
          </div>
          <div style="background-color:#f5f0eb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <p style="color:#666;margin:0;font-size:13px;line-height:1.6;">
              <strong>Didn't request this?</strong> If you didn't create an account on SHUATS RentMart, please ignore this email. No account will be created.
            </p>
          </div>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
          <p style="color:#bbb;font-size:11px;margin:4px 0 0;">Exclusively for SHUATS University Students</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getEmailVerifiedSuccess = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">Email Verified!</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <div style="font-size:64px;margin-bottom:16px;">✅</div>
          <h2 style="color:#333;margin-bottom:16px;">Email Verified Successfully!</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:24px;">
            Hi <strong>${name}</strong>, your email has been verified successfully. Your account is now pending admin approval.
          </p>
          <div style="background-color:#f0fdf4;border-left:4px solid #4a7c59;padding:16px;border-radius:8px;text-align:left;">
            <p style="color:#333;margin:0 0 8px;font-weight:600;">Next Steps:</p>
            <p style="color:#666;margin:0;font-size:13px;line-height:1.6;">
              An admin will review your student ID card and approve your account. You'll receive a notification once approved.
            </p>
          </div>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getWelcomeEmail = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">Campus Marketplace</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#333;margin-bottom:16px;">Welcome, ${name}! 🎉</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:20px;">
            Thank you for registering on SHUATS RentMart. Your email has been verified and your account is now pending admin approval.
          </p>
          <div style="background-color:#f0fdf4;border-left:4px solid #4a7c59;padding:16px;border-radius:8px;margin-bottom:20px;">
            <p style="color:#333;margin:0;font-weight:600;">What happens next?</p>
            <ul style="color:#666;margin:8px 0 0;padding-left:20px;line-height:1.8;">
              <li>An admin will review your student ID card</li>
              <li>You'll receive an email once approved</li>
              <li>Then you can start using the marketplace!</li>
            </ul>
          </div>
          <p style="color:#999;font-size:12px;margin-top:24px;">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAccountApprovedEmail = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">Account Update</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <div style="font-size:64px;margin-bottom:16px;">🎉</div>
          <h2 style="color:#333;margin-bottom:16px;">Account Approved!</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:24px;">
            Dear <strong>${name}</strong>, your SHUATS RentMart account has been <strong style="color:#4a7c59;">approved</strong> by the administrator.
          </p>
          <div style="background-color:#f0fdf4;border-left:4px solid #4a7c59;padding:16px;border-radius:8px;text-align:left;margin-bottom:20px;">
            <p style="color:#333;margin:0 0 8px;font-weight:600;">You can now:</p>
            <ul style="color:#666;margin:0;padding-left:20px;line-height:1.8;">
              <li>Browse and list items for rent or sale</li>
              <li>Connect with fellow SHUATS students</li>
              <li>Send and receive requests</li>
              <li>Chat with other users</li>
            </ul>
          </div>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display:inline-block;background:linear-gradient(135deg,#2d5016,#4a7c59);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:14px;">
            Login Now →
          </a>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAccountRejectedEmail = (name, reason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#dc2626,#ef4444);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#fecaca;margin:8px 0 0;font-size:14px;">Account Update</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#333;margin-bottom:16px;">Account Registration Update</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:20px;">
            Dear <strong>${name}</strong>, we regret to inform you that your SHUATS RentMart account registration has been <strong style="color:#dc2626;">rejected</strong>.
          </p>
          ${reason ? `
            <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;margin-bottom:20px;">
              <p style="color:#991b1b;margin:0 0 4px;font-weight:600;font-size:13px;">Rejection Reason:</p>
              <p style="color:#dc2626;margin:0;font-size:14px;">${reason}</p>
            </div>
          ` : ''}
          <div style="background-color:#f5f0eb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <p style="color:#666;margin:0;font-size:13px;line-height:1.6;">
              If you believe this is an error, please contact the administration at
              <a href="mailto:support@shuats.edu.in" style="color:#4a7c59;font-weight:600;">support@shuats.edu.in</a>
            </p>
          </div>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getResetPasswordEmail = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">Password Reset</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#333;margin-bottom:16px;">Reset Your Password 🔒</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:24px;">
            Hi <strong>${name}</strong>, you requested a password reset. Click the button below to set a new password.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2d5016,#4a7c59);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:14px;">
              Reset Password
            </a>
          </div>
          <p style="color:#999;font-size:12px;text-align:center;">
            This link will expire in 1 hour.
          </p>
          <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;margin-top:20px;">
            <p style="color:#991b1b;margin:0;font-size:13px;">
              If you didn't request this reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getNewRequestEmail = (sellerName, itemTitle, requesterName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#2d5016,#4a7c59);padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:#a8d5ba;margin:8px 0 0;font-size:14px;">New Request</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#333;margin-bottom:16px;">New Request Received! 📬</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:20px;">
            Dear <strong>${sellerName}</strong>,
          </p>
          <p style="color:#666;line-height:1.6;margin-bottom:20px;">
            <strong>${requesterName}</strong> has sent a request for your item: <strong style="color:#4a7c59;">${itemTitle}</strong>
          </p>
          <div style="background-color:#f0fdf4;border-left:4px solid #4a7c59;padding:16px;border-radius:8px;margin-bottom:20px;">
            <p style="color:#333;margin:0;font-size:13px;line-height:1.6;">
              Please log in to your SHUATS RentMart account to review and respond to this request.
            </p>
          </div>
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getForumAccessEmail = (name, approved) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f0eb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,${approved ? '#2d5016,#4a7c59' : '#dc2626,#ef4444'});padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">📚 SHUATS RentMart</h1>
          <p style="color:${approved ? '#a8d5ba' : '#fecaca'};margin:8px 0 0;font-size:14px;">Forum Access Update</p>
        </div>
        <div style="padding:32px;text-align:center;">
          <div style="font-size:64px;margin-bottom:16px;">${approved ? '🎉' : '❌'}</div>
          <h2 style="color:#333;margin-bottom:16px;">Forum Access ${approved ? 'Granted' : 'Denied'}</h2>
          <p style="color:#666;line-height:1.6;margin-bottom:24px;">
            Dear <strong>${name}</strong>, your request for campus forum access has been
            <strong style="color:${approved ? '#4a7c59' : '#dc2626'};"> ${approved ? 'approved' : 'denied'}</strong>.
          </p>
          ${approved ? `
            <div style="background-color:#f0fdf4;border-left:4px solid #4a7c59;padding:16px;border-radius:8px;text-align:left;">
              <p style="color:#333;margin:0;font-size:13px;line-height:1.6;">
                You can now create and publish posts on the campus forum! Share knowledge, ask questions, and connect with fellow students.
              </p>
            </div>
          ` : `
            <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:8px;text-align:left;">
              <p style="color:#991b1b;margin:0;font-size:13px;line-height:1.6;">
                Please contact administration for more details about why your request was denied.
              </p>
            </div>
          `}
        </div>
        <div style="background-color:#f5f0eb;padding:20px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2025 SHUATS RentMart. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};