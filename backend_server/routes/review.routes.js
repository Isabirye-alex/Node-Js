const express = require('express');
const router = express.Router();
const {   postReview,
  getReviews,
  editReview,
  deleteReview, } = require('../controllers/review.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getReviews);    // GET /categories
router.post('/', postReview);
router.patch('/:id', editReview);
router.delete('/:id', deleteReview);// POST /categories

module.exports = router;
