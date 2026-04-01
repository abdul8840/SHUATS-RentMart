import User from '../models/User.js';

export const calculateTrustScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 50;

    let score = 50; // Base score

    // Account age bonus (max 10 points)
    const accountAgeInDays = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const ageBonus = Math.min(Math.floor(accountAgeInDays / 30) * 2, 10);
    score += ageBonus;

    // Successful transactions bonus (max 15 points)
    if (user.totalTransactions > 0) {
      const successRate = user.successfulTransactions / user.totalTransactions;
      score += Math.floor(successRate * 15);
    }

    // Completed rentals bonus (max 10 points)
    if (user.totalRentals > 0) {
      const rentalRate = user.completedRentals / user.totalRentals;
      score += Math.floor(rentalRate * 10);
    }

    // Positive reviews bonus (max 10 points)
    const totalReviews = user.positiveReviews + user.negativeReviews;
    if (totalReviews > 0) {
      const positiveRate = user.positiveReviews / totalReviews;
      score += Math.floor(positiveRate * 10);
    }

    // Activity bonus (max 5 points)
    if (user.totalTransactions >= 5) score += 2;
    if (user.totalTransactions >= 10) score += 3;

    // Penalties
    // Reports penalty (max -15 points)
    score -= Math.min(user.totalReports * 5, 15);

    // Cancellations penalty (max -10 points)
    score -= Math.min(user.cancellations * 3, 10);

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Update user trust score
    await User.findByIdAndUpdate(userId, { trustScore: score });

    return score;
  } catch (error) {
    console.error('Trust score calculation error:', error.message);
    return 50;
  }
};

export const getTrustLevel = (score) => {
  if (score >= 90) return { level: 'Excellent', color: 'green', badge: '⭐⭐⭐⭐⭐' };
  if (score >= 75) return { level: 'Very Good', color: 'blue', badge: '⭐⭐⭐⭐' };
  if (score >= 60) return { level: 'Good', color: 'teal', badge: '⭐⭐⭐' };
  if (score >= 40) return { level: 'Average', color: 'yellow', badge: '⭐⭐' };
  if (score >= 20) return { level: 'Below Average', color: 'orange', badge: '⭐' };
  return { level: 'Poor', color: 'red', badge: '⚠️' };
};