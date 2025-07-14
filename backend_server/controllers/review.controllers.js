const db = require('./db.controller.js');

async function postReview(req, res) {
    try {
    const {user_id} = req.params;
        const { product_id, rating, comment } = req.body;
        if (!product_id || !rating || !comment) {
            return res.status(409).json({ success: false, message: 'Required fields are missing' });
        }
        // ✅ Correct: Check for both user_id and product_id
        const [existing] = await db.query(
          'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
          [user_id, product_id]
        );

        if (existing.length > 0) {
          // Review already exists → update
          const [response] = await db.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND product_id = ?',
            [rating, comment, user_id, product_id]
          );
          return res.status(201).json({
            success: true,
            message: 'Review updated successfully',
            data: response,
          });
        } else {
          // Review doesn't exist → insert new
          const [result] = await db.query(
            'INSERT INTO reviews(user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, product_id, rating, comment]
          );
          return res.status(201).json({
            success: true,
            message: 'Review posted successfully',
            data: result,
          });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Could not post review', error: error.message });
    }
}

async function editReview(req, res) {

    try {
        const { user_id, product_id, rating, comment } = req.body;
        if (!user_id || !product_id || !rating || !comment) {
            return res.status(409).json({ success: false, message: 'Required fields are missing' });
        }
        const [user] = await db.query('SELECT * FROM reviews WHERE user_id = ?', [user_id]);
        if (user) {
            const [response] = await db.query('UPDATE reviews SET rating = ?, comment = ? WHERE user = ? and product_id=?', [rating, comment, user_id, product_id]);
            return res.status(201).json({ sucess: true, message: 'Review updated successfully', data: response});
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update review', error: error.message });
    }

}

async function getReviews(req, res) {
  try {
    const { user_id, product_id } = req.params;

    // Fetch only reviews for this product
    const [allReviews] = await db.query('SELECT * FROM reviews WHERE product_id = ?', [product_id]);

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatings = 0;

    allReviews.forEach(review => {
      if (review.user_id == user_id) return; // skip current user's review
      const r = Math.round(review.rating);
      if (ratingCounts[r] !== undefined) {
        ratingCounts[r]++;
        totalRatings++;
      }
    });

    // Get user review + top others (for this product only)
    const [response] = await db.query(`
      (SELECT * FROM reviews WHERE user_id = ? AND product_id = ?)
      UNION ALL
      (SELECT * FROM reviews WHERE user_id != ? AND product_id = ? ORDER BY rating DESC LIMIT 10)
    `, [user_id, product_id, user_id, product_id]);

    const hasUserReview = response.length > 0 && response[0].user_id == user_id;
    const userReview = hasUserReview ? response[0] : null;
    const otherReviews = hasUserReview ? response.slice(1) : response;

    return res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: {
        hasUserReview,
        userReview,
        otherReviews,
        ratingCounts,
        totalRatings
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch reviews', error: error.message });
  }
}

async function deleteReview(req, res) {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(404).json({ success: false, message: 'Required fields are missing' });

        }
        //check if has has posted a review yet
        const [user] = await db.query('SELECT * FROM reviews WHERE user_id = ?', [user_id]);
        if (user) {
            const response = await db.query('DELETE FROM reviews WHERE user_id = ?', [user_id]);
            return res.status(201).json({ success: true, message: 'Review deleted successfully', data: response });
        }
     } catch (error) {
        return res.status(500).json({ success: false, message: 'Unknown error occurred', error: error.message });
    }
    
}

module.exports = {
    deleteReview,
    getReviews,
    editReview,
    postReview
}