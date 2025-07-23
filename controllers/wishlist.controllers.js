const db = require('./db.controller.js');
async function createWishlist(req, res) {
    try {
        const {user_id} = req.params;
        const { product_id} = req.body;
        if (!product_id ||! user_id) {
            return res.status(409).json({ sucess: false, message: 'Required fields are missing' });
        }
        
        const [response] = await db.query('INSERT INTO wishlist(user_id, product_id)VALUES(?,?) ON DUPLICATE KEY UPDATE created_at = NOW()',
            [user_id, product_id]);
        return res.status(201).json({ sucess: true, message: 'Product added to wishlist', data: response });
    } catch (error) {
        return res.status(500).json({ sucess: false, message: 'Failed to add item to wishlist', error: error.message });

    }
}

async function getWishList(req, res) {
    try { 
        const {user_id }= req.params;
        const response = await db.query('SELECT * FROM wishlist WHERE user_id = ?', [user_id]);
        return res.status(201).json({ success: true, message: 'Wishlist successfully retrived', data: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve users wishlist', error: error.message });
    }  
}

async function getWishListItems(req, res) {
    try { 
        const { user_id } = req.params;
        const [response] = await db.query(
            `
            SELECT wlst.*, p.imageUrl as product_image,
             p.price as product_price,
              p.name as product_name,

              p.description as product_description,
              u.imageUrl as user_image
            FROM wishlist wlst
            JOIN products p ON wlst.product_id = p.id
            JOIN users u ON wlst.user_id = u.id
            WHERE wlst.user_id = ?          
            `, [user_id]);
            return res.status(201).json({success: true, message:'Wishlist items successfully retrieved', data: response});
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to get wishlist items', error: error.message });
    }
    
}

async function deleteItemFromWishlist(req, res) {
  try {
    const { user_id } = req.params;
    const { product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, message: 'Missing user_id or product_id' });
    }

    const [response] = await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    return res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message,
    });
  }
}



module.exports = {
deleteItemFromWishlist,
createWishlist,
getWishListItems
}