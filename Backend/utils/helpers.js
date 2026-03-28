import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const parseSHUATSEmail = (email) => {
  const match = email.match(/^(\d{2})([A-Za-z]+)(\d{3})@(shiats|shuats)\.com$/);
  if (match) {
    return {
      year: match[1],
      course: match[2].toUpperCase(),
      rollNumber: match[3],
      domain: match[4]
    };
  }
  return null;
};

export const paginateResults = (page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  return { skip, limit: limitNum, page: pageNum };
};

export const buildSearchQuery = (filters) => {
  const query = {};

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.department) {
    query.department = { $regex: filters.department, $options: 'i' };
  }

  if (filters.semester) {
    query.semester = parseInt(filters.semester);
  }

  if (filters.condition) {
    query.condition = filters.condition;
  }

  if (filters.listingType) {
    query.listingType = filters.listingType;
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
  }

  return query;
};