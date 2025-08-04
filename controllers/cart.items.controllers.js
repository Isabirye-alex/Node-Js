// Add item to cart
const db = require('./db.controller.js');

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

    // Get product price
    const [productRows] = await db.query(
      'SELECT price FROM products WHERE id = ?',
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productPrice = parseFloat(productRows[0].price);
    const itemTotal = productPrice * quantity;

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

    // Update total_price in cart
    await db.query(
      'UPDATE carts SET total_price = total_price + ? WHERE id = ?',
      [itemTotal, cartId]
    );

    res.status(200).json({
      success: true,
      message: 'Item added/updated in cart and total price updated',
      data: { cart_id: cartId, product_id: productId, quantity, itemTotal }
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
      `SELECT 
         ci.*, 
         p.price, 
         p.name AS title, 
         p.imageUrl AS imageUrl 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.cart_id = ? AND c.status = 'pending'`,
      [cartId]
    );

    if (items.length === 0) {
      return res.status(200).json({ success: false, message: 'No pending cart items found' });
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

// Get active cart by user ID
async function getActiveCart(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const [rows] = await db.query(
      `SELECT id, total_price, status 
       FROM carts 
       WHERE user_id = ? AND status = 'pending' 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No active cart found' });
    }

    res.status(200).json({
      success: true,
      message: 'Active cart retrieved',
      data: rows[0] // includes id, total_price, status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active cart',
      error: error.message
    });
  }
}

// Decrease quantity
async function decreaseCartItemQuantity(req, res) {
  try {
    const { itemId } = req.params;

    const [itemRows] = await db.query(
      'SELECT quantity, cart_id, product_id FROM cart_items WHERE id = ?',
      [itemId]
    );

    if (itemRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const item = itemRows[0];

    if (item.quantity <= 1) {
      // Optionally delete item if quantity reaches 0
      await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      // Get price
      const [productRows] = await db.query(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );

      const price = parseFloat(productRows[0].price);

      await db.query(
        'UPDATE cart_items SET quantity = quantity - 1 WHERE id = ?',
        [itemId]
      );

      await db.query(
        'UPDATE carts SET total_price = total_price - ? WHERE id = ?',
        [price, item.cart_id]
      );
    }

    res.status(200).json({ success: true, message: 'Quantity decreased' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error decreasing quantity', error: error.message });
  }
}



module.exports = {
  addItemToCart,
  getItemsByCartId,
  removeItemFromCart,
  getActiveCart,
  decreaseCartItemQuantity
};
