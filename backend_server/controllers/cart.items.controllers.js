const db = require('../controllers/db.controller.js');

// Add item to cart
async function addItemToCart(req, res) {
  try {
    const { cartId, productId, quantity } = req.body;

    if (!cartId || !productId || !quantity) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      
      

    await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cartId, productId, quantity]
    );

    res.status(201).json({ success: true, message: 'Item added to cart' });
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
