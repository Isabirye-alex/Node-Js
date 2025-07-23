const db = require('../controllers/db.controller.js');

// Create Cart
async function createCart(req, res) {
  try {
    const { user_id, total_price, status } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if user already has an active/pending cart
    const [existing] = await db.query(
      'SELECT * FROM carts WHERE user_id = ? AND status = ?',
      [user_id, 'pending']
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Existing cart retrieved',
        data: existing[0]
      });
    }

    const [result] = await db.query(
      'INSERT INTO carts (user_id, total_price, status) VALUES (?, ?, ?)',
      [user_id, total_price || 0, status || 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'New cart created',
      data: { cartId: result.insertId, user_id, total_price: total_price || 0, status: status || 'pending' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating cart', error: error.message });
  }
}


// Get All Carts
async function getCarts(req, res) {
  try {
    const [carts] = await db.query('SELECT * FROM carts');
    res.status(200).json({
      success: true,
      message: carts.length ? 'Carts retrieved successfully' : 'No carts found',
      data: carts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching carts', error: error.message });
  }
}

// Get Cart by ID
async function getCartById(req, res) {
  try {
    const { id } = req.params;
    const [cart] = await db.query('SELECT * FROM carts WHERE id = ?', [id]);

    if (cart.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart retrieved successfully', data: cart[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid cart ID', error: error.message });
  }
}

// Update Cart
async function updateCart(req, res) {
  try {
    const { id } = req.params;
    const { status, total_price } = req.body;

    if (!status && total_price == null) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    const [result] = await db.query(
      'UPDATE carts SET status = ?, total_price = ? WHERE id = ?',
      [status || 'pending', total_price || 0, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
}

// Delete Cart
async function deleteCart(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM carts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting cart', error: error.message });
  }
}

module.exports = {
  createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart
};
