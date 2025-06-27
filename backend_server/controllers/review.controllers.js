const Review = require('../models/review.model');

// Create Review
async function createReview(req, res) {
  try {
    const { user, product, rating, comment } = req.body;

    if (!user || !product || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const review = new Review({ user, product, rating, comment });
    await review.save();

    res.status(201).json({ success: true, message: 'Review created successfully', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
  }
}

// Get All Reviews
async function getReviews(req, res) {
  try {
    const reviews = await Review.find().populate('user').populate('product');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
}

// Get Review by ID
async function getReviewById(req, res) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate('user').populate('product');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving review' });
  }
}

// Delete Review
async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Review not found' });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting review' });
  }
}

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
};
