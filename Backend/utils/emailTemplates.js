export const getWelcomeEmail = (name) => {
  return `
    <div>
      <h2>Welcome to SHUATS RentMart, ${name}!</h2>
      <p>Thank you for registering on SHUATS RentMart - Your Campus Rental & Resale Platform.</p>
      <p>Your account is currently <strong>pending approval</strong>. Our admin team will review your student ID card and approve your account shortly.</p>
      <p>You will receive an email notification once your account has been reviewed.</p>
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};

export const getAccountApprovedEmail = (name) => {
  return `
    <div>
      <h2>Account Approved! 🎉</h2>
      <p>Dear ${name},</p>
      <p>Your SHUATS RentMart account has been <strong>approved</strong> by the administrator.</p>
      <p>You can now log in and start using the platform to rent, sell, and browse items!</p>
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};

export const getAccountRejectedEmail = (name, reason) => {
  return `
    <div>
      <h2>Account Registration Update</h2>
      <p>Dear ${name},</p>
      <p>We regret to inform you that your SHUATS RentMart account registration has been <strong>rejected</strong>.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is an error, please contact the administration.</p>
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};

export const getResetPasswordEmail = (name, resetUrl) => {
  return `
    <div>
      <h2>Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>You have requested to reset your password. Click the link below to reset:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4F46E5;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};

export const getNewRequestEmail = (sellerName, itemTitle, requesterName) => {
  return `
    <div>
      <h2>New Request Received</h2>
      <p>Dear ${sellerName},</p>
      <p><strong>${requesterName}</strong> has sent a request for your item: <strong>${itemTitle}</strong></p>
      <p>Please log in to your SHUATS RentMart account to review and respond to this request.</p>
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};

export const getForumAccessEmail = (name, approved) => {
  return `
    <div>
      <h2>Forum Access ${approved ? 'Granted' : 'Denied'}</h2>
      <p>Dear ${name},</p>
      <p>Your request for campus forum access has been <strong>${approved ? 'approved' : 'denied'}</strong>.</p>
      ${approved ? '<p>You can now create and publish posts on the campus forum!</p>' : '<p>Please contact administration for more details.</p>'}
      <br/>
      <p>Best regards,</p>
      <p>SHUATS RentMart Team</p>
    </div>
  `;
};