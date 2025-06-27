const Coupon = require('../models/coupon.model');

// Create Coupon
async function createCoupon(req, res) {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating coupon', error: error.message });
  }
}

// Get All Coupons
async function getCoupons(req, res) {
  try {
    const coupons = await Coupon.find().populate('applicableCategory');
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
}

// Get Coupon by ID
async function getCouponById(req, res) {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id).populate('applicableCategory');
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving coupon' });
  }
}

// Delete Coupon
async function deleteCoupon(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting coupon' });
  }
}

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon
};
