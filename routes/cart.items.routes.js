const express = require('express');
const router = express.Router();

// Import the whole controller first, then destructure
const controller = require('../controllers/cart.items.controllers.js');

// DEBUG: Log what’s actually being imported
// console.log('Controller:', controller);

const { addItemToCart, getItemsByCartId, removeItemFromCart, getActiveCart,decreaseCartItemQuantity} = controller;

// Routes to handle all user functions related to cart items
router.post('/addtocart', addItemToCart);
router.get('/activecart/:userId', getActiveCart);
router.get('/getcartitems/:cartId', getItemsByCartId);

router.delete('/deleteitem/:itemId', removeItemFromCart);
router.patch('/decrease/:itemId',decreaseCartItemQuantity);


module.exports = router;
