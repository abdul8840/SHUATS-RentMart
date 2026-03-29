import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  listingType: {
    type: String,
    enum: ['rent', 'sell'],
    required: [true, 'Listing type (rent/sell) is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Books',
      'Previous Year Papers',
      'Calculators',
      'Electronic Devices',
      'Lab Equipment',
      'Stationery',
      'Sports Equipment',
      'Musical Instruments',
      'Clothing',
      'Furniture',
      'Other'
    ]
  },
  department: {
    type: String,
    required: [true, 'Department relevance is required']
  },
  semester: {
    type: Number,
    min: 1,
    max: 10
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    required: [true, 'Item condition is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['fixed', 'negotiable'],
    default: 'fixed'
  },
  rentalPeriod: {
    type: String,
    enum: ['per_day', 'per_week', 'per_month', 'per_semester'],
    default: 'per_month'
  },
  images: [{
    public_id: String,
    url: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'removed', 'pending'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, department: 1, semester: 1 });
itemSchema.index({ seller: 1 });
itemSchema.index({ status: 1, isAvailable: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;