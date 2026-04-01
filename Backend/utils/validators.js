export const validateSHUATSEmail = (email) => {
  const regex = /^\d{2}[A-Za-z]+\d{3}@(shiats|shuats)\.edu\.in$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateOTP = (otp) => {
  if (!otp) return 'OTP is required';
  if (otp.length !== 6) return 'OTP must be 6 digits';
  if (!/^\d{6}$/.test(otp)) return 'OTP must contain only numbers';
  return null;
};

export const validateRegistration = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email) {
    errors.push('Email is required');
  } else if (!validateSHUATSEmail(data.email)) {
    errors.push(
      'Invalid email format. Use SHUATS email (e.g., 24MCA020@shiats.edu.in or 24MCA020@shuats.edu.in)'
    );
  }

  if (!data.password) {
    errors.push('Password is required');
  } else if (!validatePassword(data.password)) {
    errors.push('Password must be at least 6 characters');
  }

  if (!data.department) {
    errors.push('Department is required');
  }

  if (!data.semester || data.semester < 1 || data.semester > 10) {
    errors.push('Valid semester (1-10) is required');
  }

  return errors;
};

export const validateItemListing = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Item title is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!data.listingType || !['rent', 'sell'].includes(data.listingType)) {
    errors.push('Listing type must be rent or sell');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.condition) {
    errors.push('Item condition is required');
  }

  if (data.price === undefined || data.price < 0) {
    errors.push('Valid price is required');
  }

  return errors;
};