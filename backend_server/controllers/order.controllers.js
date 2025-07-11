const db = require('./db.controller.js');


// Create Order
async function createOrder(req, res) {
  try {
    const {
      user_id,
      total_amount,
      shipping_address,
      payment_method,
      is_paid,
      paid_at,
      delivered_at,
      status
    } = req.body;

    // Basic validation
    if (!user_id || !total_amount || !shipping_address || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const [result] = await db.query(
      `INSERT INTO orders 
        (user_id, total_amount, shipping_address, payment_method, is_paid, paid_at, delivered_at, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        total_amount,
        shipping_address,
        payment_method,
        is_paid || false,
        paid_at || null,
        delivered_at || null,
        status || 'pending'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        id: result.insertId,
        user_id,
        total_amount,
        shipping_address,
        payment_method,
        is_paid: is_paid || false,
        paid_at: paid_at || null,
        delivered_at: delivered_at || null,
        status: status || 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
}

// Get All Orders
async function getOrders(req, res) {
  try {
    const [orders] = await db.query(`
      SELECT orders.*, users.firstName AS user_name
      FROM orders
      JOIN users ON orders.user_id = users.id
    `);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
}

// Get Order by ID
async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT orders.*, users.name AS user_name
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE orders.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid order ID', error: error.message });
  }
}

// Update Order
async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const {
      total_amount,
      status,
      shipping_address,
      payment_method,
      is_paid,
      paid_at,
      delivered_at
    } = req.body;

    const [result] = await db.query(
      `UPDATE orders 
       SET total_amount = ?, status = ?, shipping_address = ?, 
           payment_method = ?, is_paid = ?, paid_at = ?, delivered_at = ?
       WHERE id = ?`,
      [
        total_amount,
        status,
        shipping_address,
        payment_method,
        is_paid,
        paid_at,
        delivered_at,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
  }
}

// Delete Order
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,

};
