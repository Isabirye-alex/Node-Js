const express = require('express');
const router = express.Router();
const { createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon } = require('../controllers/coupon.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getCoupons);    // GET /categories
router.post('/', createCoupon);
router.get('/:id', getCouponById); 
router.delete('/:id', deleteCoupon);// POST /categories

module.exports = router;
