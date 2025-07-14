const express = require('express');
const router = express.Router();
const {postReview,
  getReviews,
  editReview,
  deleteReview } = require('../controllers/review.controllers.js');


router.get('/getreviews/:user_id/:product_id', getReviews);
router.post('/postreview/:user_id', postReview);
router.patch('/updatereview/:id', editReview);
router.delete('/:id', deleteReview);

module.exports = router;
