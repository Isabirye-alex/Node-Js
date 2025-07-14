const express = require('express');
const router = express.Router();
const {  deleteItemFromWishlist,
         createWishlist,
         getWishListItems} = require('../controllers/wishlist.controllers.js');


router.get('/getitems/:user_id', getWishListItems);
router.post('/additem/:user_id', createWishlist);
router.delete('/removefromwishlist/:user_id', deleteItemFromWishlist);

module.exports = router;
