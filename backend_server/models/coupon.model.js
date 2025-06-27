const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  minimumPurchaseAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    tyep: Number,
    required: true
  },
  applicableCategory: {
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId
  },
  discountType: {
    type: String,
    enum: ['fixed', 'percentage'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true }

);

const Coupon = model('Coupon', couponSchema);
module.exports = Coupon;
