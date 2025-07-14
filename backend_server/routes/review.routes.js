const express = require('express');
const router = express.Router();
const {postReview,
  getReviews,
  editReview,
  deleteReview } = require('../controllers/review.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/getreviews/:user_id', getReviews);
router.post('/postreview', postReview);
router.patch('/updatereview/:id', editReview);
router.delete('/:id', deleteReview);

module.exports = router;
