const Order = require('../models/order.model.js');

// Create Order
async function createOrder(req, res) {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      isPaid,
      paidAt,
      deliveredAt
    } = req.body;

    // Basic validation
    if (!userId || !items || !items.length || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      isPaid,
      paidAt,
      deliveredAt
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
}

// Get All Orders
async function getOrders(req, res) {
  try {
    const orders = await Order.find().populate('userId').populate('items.productId');
    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
}

// Get Order by ID
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('userId').populate('items.productId');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid order ID' });
  }
}

// Update Order
async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId').populate('items.productId');

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
}

// Delete Order
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
