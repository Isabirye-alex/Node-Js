const express = require('express');
const router = express.Router();
const { createCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon } = require('../controllers/coupon.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getCoupons);    // GET /categories
router.post('/', createCoupon); 
router.delete('/:id', deleteCoupon);// POST /categories
router.post('/applycoupon', applyCoupon);

// router.put('/:id', updateUser);

module.exports = router;
