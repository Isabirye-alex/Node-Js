const express = require('express');
const router = express.Router();
const {   postReview,
  getReviews,
  editReview,
  deleteReview, } = require('../controllers/review.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/getreviews/:user_id', getReviews);    // GET /categories
router.post('/postreview', postReview);
router.patch('/updatereview/:id', editReview);
router.delete('/:id', deleteReview);// POST /categories

module.exports = router;
