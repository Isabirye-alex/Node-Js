const express = require('express');
const router = express.Router();
const {  deleteItemFromWishlist,
         createWishlist,
         getWishListItems} = require('../controllers/wishlist.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/getitems/:user_id', getWishListItems);    // GET /categories
router.post('/additem', createWishlist);
router.delete('/removefromwishlist:id', deleteReview);// POST /categories

module.exports = router;
