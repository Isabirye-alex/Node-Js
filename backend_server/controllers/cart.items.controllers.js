const db = require('../controllers/db.controller.js');

// Add item to cart
const db = require('../controllers/db.controller.js');

// Add or update item in cart, auto-create cart if none exists
async function addItemToCart(req, res) {
  try {
    const { user_id, productId, quantity } = req.body;

    if (!user_id || !productId || !quantity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user has a pending cart
    let [cartRows] = await db.query(
      'SELECT * FROM carts WHERE user_id = ? AND status = ?',
      [user_id, 'pending']
    );

    let cartId;

    if (cartRows.length > 0) {
      cartId = cartRows[0].id;
    } else {
      // Create new cart if none exists
      const [cartResult] = await db.query(
        'INSERT INTO carts (user_id, total_price, status) VALUES (?, ?, ?)',
        [user_id, 0, 'pending']
      );
      cartId = cartResult.insertId;
    }

    // Check if product already exists in this cart
    const [itemRows] = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (itemRows.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
    } else {
      // Insert new item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Item added/updated in cart',
      data: { cart_id: cartId, product_id: productId, quantity }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart', error: error.message });
  }
}

// Get items by cart ID
async function getItemsByCartId(req, res) {
  try {
    const { cartId } = req.params;

    const [items] = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'No items found for this cart' });
    }

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart items', error: error.message });
  }
}

// Remove item from cart
async function removeItemFromCart(req, res) {
  try {
    const { itemId } = req.params;

    const [result] = await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing item', error: error.message });
  }
}

module.exports = {
  addItemToCart,
  getItemsByCartId,
  removeItemFromCart
};
