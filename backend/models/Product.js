import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['tshirts', 'caps', 'jackets', 'bottoms', 'accessories'],
    lowercase: true
  },
  image1: {
    type: String,
    required: [true, 'First image URL is required']
  },
  image2: {
    type: String,
    required: [true, 'Second image URL is required']
  },
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  }],
  colors: [String],
  details: [{
    label: String,
    value: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Product', productSchema);
