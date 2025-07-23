const db = require('./db.controller.js');

// Create Order
async function createOrder(req, res) {
  const connection = await db.getConnection(); // Use a connection from pool

  try {
    const {
           cart_id,
      user_id,
      total_amount,
      shipping_address,
      payment_method,
      is_paid,
      paid_at,
      delivered_at,
      status,
      items, // <-- items from cart
    } = req.body;

    // Validate required fields
    if (!user_id || !total_amount || !shipping_address || !payment_method || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'All required fields including items must be provided',
      });
    }

    await connection.beginTransaction();

    // Insert order
    const [orderResult] = await connection.query(
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
        status || 'pending',
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      const { product_id, quantity, price } = item;

      if (!product_id || !quantity || !price) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: 'Invalid item format' });
      }

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, product_id, quantity, price]
      );
    }

await connection.query(
  'UPDATE carts SET status = ? WHERE id = ? AND user_id = ? AND status = ?',
  ['ordered', cart_id, user_id, 'pending']
);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order and items saved successfully',
      data: {
        order_id: orderId,
      },
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  } finally {
    connection.release(); // release connection
  }
}

async function getOrderItems(req, res) {
  try {
    const { orderId } = req.params;

    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.imageUrl AS product_image, p.price AS product_price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'No items found for this order' });
    }

    res.status(200).json({
      success: true,
      message: 'Order items retrieved successfully',
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving order items', error: error.message });
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
async function getOrderByUserId(req, res) {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(`
      SELECT orders.*, users.username AS username
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE orders.user_id = ?
      ORDER BY orders.created_at DESC
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    } 

    console.log(rows);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving orders', error: error.message });
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
  getOrderByUserId,
  updateOrder,
  deleteOrder,
  getOrderItems

};
