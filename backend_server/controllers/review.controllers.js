const db = require('./db.controller.js');

async function postReview(req, res) {
    try {
        const { user_id, product_id, rating, comment } = req.body;
        if (!user_id || !product_id || !rating || !comment) {
            return res.status(409).json({ success: false, message: 'Required fields are missing' });
        }
        //Check if user has ever posted a review on that particular product
        const [user] = await db.query(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
        if (user) {
            const [response] = await db.query(`UPDATE reviews SET rating = ?, comment = ? WHERE user = ? and product_id=?`, [rating, comment, user_id, product_id]);
            return res.status(201).json({ sucess: true, message: 'Review updated successfully', data: response });
        }
        //Post new review
        else {
            const [result] = await db.query('INSERT INTO reviews(user_id, product_id, rating, comment) VALUES(?,?,?,?)',
                [user_id, product_id, rating, comment]);
    
            return res.status(201).json({ sucess: true, message: 'Review posted succesfully', data: result });
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
        const [user] = await db.query(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
        if (user) {
            const [response] = await db.query(`UPDATE reviews SET rating = ?, comment = ? WHERE user = ? and product_id=?`, [rating, comment, user_id, product_id]);
            return res.status(201).json({ sucess: true, message: 'Review updated successfully', data: response});
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update review', error: error.message });
    }

}

async function getReviews(req, res) {
    try {
        const page = 1;
        const limit = 10;
        const offset = (page - limit);
        const { user_id } = req.body;
        const [response] = await db.query(`(SELECT * FROM reviews WHERE user_id = ?) UNION ALL(SELECT * FROM reviews WHERE user_id!=? ORDER BY rating DESC LIMIT ? OFFSET)`, [user_id, user_id, limit, offset]);
        const hasUserReview = response.length > 0 && response[0].user_id === user_id;
        const userReview = hasUserReview ? response[0] : null;
        const otherReviews = hasUserReview ? response.slice(1) : response;
        return res.status(201).json({ success: true, message: 'Reviews fetched successfully', data: { hasUserReview, userReview, otherReviews } });
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
        const [user] = await db.query(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
        if (user) {
            const response = await db.query(`DELETE FROM reviews WHERE user_id = ?`, [user_id]);
            return res.status(201).json({ success: true, message: 'Review deleted successfully', data: response });
        }
     } catch (error) {
        return res.status(500).json({ success: false, message: 'Unknown error occurred', error: error.message });
    }
    
}