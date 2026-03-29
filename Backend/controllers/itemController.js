import Item from '../models/Item.js';
import { uploadBase64ToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { validateItemListing } from '../utils/validators.js';
import { buildSearchQuery, paginateResults } from '../utils/helpers.js';

// Create item listing
export const createItem = async (req, res) => {
  try {
    const { title, description, listingType, category, department, semester, condition, price, priceType, rentalPeriod, images, tags } = req.body;

    const errors = validateItemListing({ title, description, listingType, category, condition, price });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const img of images) {
        const result = await uploadBase64ToCloudinary(img, 'items');
        uploadedImages.push({ public_id: result.public_id, url: result.url });
      }
    }

    const item = await Item.create({
      title,
      description,
      listingType,
      category,
      department: department || req.user.department,
      semester: semester || req.user.semester,
      condition,
      price: parseFloat(price),
      priceType: priceType || 'fixed',
      rentalPeriod: listingType === 'rent' ? (rentalPeriod || 'per_month') : undefined,
      images: uploadedImages,
      seller: req.user._id,
      tags: tags || []
    });

    await item.populate('seller', 'name department semester profileImage trustScore');

    res.status(201).json({ success: true, item, message: 'Item listed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all items (with filters)
export const getItems = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt', search, category, department, semester, condition, listingType, minPrice, maxPrice } = req.query;

    let query = { status: 'active', isAvailable: true };

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (department) query.department = { $regex: department, $options: 'i' };
    if (semester) query.semester = parseInt(semester);
    if (condition) query.condition = condition;
    if (listingType) query.listingType = listingType;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const { skip, limit: lim, page: pg } = paginateResults(page, limit);

    const items = await Item.find(query)
      .populate('seller', 'name department semester profileImage trustScore')
      .sort(sort)
      .skip(skip)
      .limit(lim);

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      items,
      pagination: {
        page: pg,
        limit: lim,
        total,
        pages: Math.ceil(total / lim)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name department semester profileImage trustScore email');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    const { title, description, listingType, category, department, semester, condition, price, priceType, rentalPeriod, images, newImages, tags, isAvailable } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (listingType) updateData.listingType = listingType;
    if (category) updateData.category = category;
    if (department) updateData.department = department;
    if (semester) updateData.semester = parseInt(semester);
    if (condition) updateData.condition = condition;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (priceType) updateData.priceType = priceType;
    if (rentalPeriod) updateData.rentalPeriod = rentalPeriod;
    if (tags) updateData.tags = tags;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    // Handle new images
    if (newImages && newImages.length > 0) {
      const uploadedImages = [];
      for (const img of newImages) {
        const result = await uploadBase64ToCloudinary(img, 'items');
        uploadedImages.push({ public_id: result.public_id, url: result.url });
      }
      updateData.images = [...(images || item.images), ...uploadedImages];
    } else if (images) {
      updateData.images = images;
    }

    item = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('seller', 'name department semester profileImage trustScore');

    res.json({ success: true, item, message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    // Delete images from cloudinary
    for (const image of item.images) {
      if (image.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get items by category
export const getItemsByCategory = async (req, res) => {
  try {
    const categories = await Item.aggregate([
      { $match: { status: 'active', isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured/recent items
export const getFeaturedItems = async (req, res) => {
  try {
    const recentItems = await Item.find({ status: 'active', isAvailable: true })
      .populate('seller', 'name department profileImage trustScore')
      .sort({ createdAt: -1 })
      .limit(8);

    const mostViewed = await Item.find({ status: 'active', isAvailable: true })
      .populate('seller', 'name department profileImage trustScore')
      .sort({ views: -1 })
      .limit(8);

    res.json({ success: true, recentItems, mostViewed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};