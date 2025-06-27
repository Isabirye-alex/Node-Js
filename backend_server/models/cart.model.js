const mongoose = require('mongoose');


const { Schema, model } = mongoose;
const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'ordered', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Cart = model('Cart', cartSchema);
module.exports = Cart;
