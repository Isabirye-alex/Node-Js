const crypto = require('crypto');
const db = require('./db.controller.js');

// Create Coupon
async function generateRandomCoupon(length = 8) {
  return crypto.randomBytes(length).
    toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length)
    .toUpperCase();

}
async function createCoupon(req, res) {
  try { 
    const {
      minimum_purchase_amount,
      applicable_category_id,

      expiry_date,
      discount_type,
      is_active,
      discount_amount,
      discount_value } = req.body;
    if (!minimum_purchase_amount || !applicable_category_id ||!discount_amount||!expiry_date || !discount_type || !discount_value||!is_active) {
      res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    let code, exists = true;
    while (exists) {
      code =await generateRandomCoupon(8);
      const [rows] = await db.query('SELECT id FROM coupons WHERE code = ? ', [code]);
      exists = rows.length > 0;
    }
    const [result] = await db.query
      ('INSERT INTO coupons (code,minimum_purchase_amount,discount_amount, applicable_category_id, expiry_date, discount_type, discount_value,is_active) VALUES(?,?,?,?,?,?,?,?)',
      [code, minimum_purchase_amount,discount_amount, applicable_category_id, expiry_date, discount_type, discount_value, is_active]);
    res.status(201).json({
      success: true, message: 'Coupon successfully generated', coupon: {
      id:result.insertId, code, discount_type, discount_value, minimum_purchase_amount,expiry_date,is_active,discount_amount
    } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not generate coupon',error:error.message });
  }
}
async function applyCoupon(req, res) {
try {
    const { code, category_id } = req.body;
    if (!code || !category_id) {
      res.status(400).json({ succes: false, message: 'Code and category are required' });
    }
    const [rows] = await db.query('SELECT * FROM coupons where code = ? AND is_active = 1 AND expiry_date>=CURDATE()', [code]);
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    }
    const coupon = rows[0];
    if (coupon.applicable_category_id !== null && coupon.applicable_category_id != parseInt(category_id)) {
      res.status(400).json({ succes: false, message: 'Coupon does not apply to this product category' });
  }
  await db.query(`UPDATE coupons SET is_active = 0, used_count = 1 WHERE id = ?`, [coupon.id]);
    res.status(201).json({
      success: true, message: 'Coupon applied successfully',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_purchase_amount: coupon.minimum_purchase_amount
    });
} catch (error) {
  res.status(500).json({ success: false, message: 'Could not apply coupon', error: error.message });
}
}
// Get All Coupons
async function getCoupons(req, res) {
  try {
    const [coupons] = await db.query('SELECT * FROM coupons');
    if (coupons.length === 0) {
      res.status(404).json({ success: false, message: 'No coupons found' });
    }
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
}

// Delete Coupon
async function deleteCoupon(req, res) {
  try {
    const { id } = req.params;
    const [deleted] = await db.query(`DELETE FROM coupons WHERE id = ?`,[id]);
    if (deleted.length ===0 ) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting coupon' });
  }
}

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon
};
