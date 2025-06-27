const Cart = require('../models/cart.model.js');

// Create Cart
async function createCart(req, res) {
  try {
    const { userId, items, totalPrice, status } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'User ID and at least one item are required' });
    }

    const newCart = new Cart({ userId, items, totalPrice, status });
    await newCart.save();

    res.status(201).json({
      success: true,
      message: 'Cart created successfully',
      data: newCart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating cart', error: error.message });
  }
}

// Get All Carts
async function getCarts(req, res) {
  try {
    const carts = await Cart.find().populate('userId').populate('items.productId');

    if (!carts.length) {
      return res.status(404).json({ success: false, message: 'No carts found' });
    }

    res.status(200).json({
      success: true,
      message: 'Carts retrieved successfully',
      data: carts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching carts' });
  }
}

// Get Cart by ID
async function getCartById(req, res) {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id).populate('userId').populate('items.productId');

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid cart ID' });
  }
}

// Update Cart
async function updateCart(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('userId').populate('items.productId');

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
}

// Delete Cart
async function deleteCart(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting cart' });
  }
}

module.exports = {
  createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart
};
