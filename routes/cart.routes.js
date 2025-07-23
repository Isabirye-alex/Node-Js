const express = require('express');
const router = express.Router();
const {   createCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart } = require('../controllers/cart.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getCarts);    // GET /categories
router.post('/', createCart);
router.get('/:id', getCartById);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);// POST /categories

module.exports = router;
