const db = require('./db.controller.js');

async function postReview(req, res) {
    try {
        const { user_id, product_id, rating, comment } = req.body;
        if (!user_id || !product_id || !rating || !comment) {
            return res.status(409).json({ success: false, message: 'Required fields are missing' });
        }
        //Check if user has ever posted a review on that particular product
        const [user] = await db.query(`SELECT * FROM reviews WHERE user_id = ?`, [user_id]);
    
        const [result] = await db.query('INSERT INTO reviews(user_id, product_id, rating, comment) VALUES(?,?,?,?)',
            [user_id, product_id, rating, comment]);
    
        return res.status(201).json({ sucess: true, message: 'Review posted succesfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Could not post review', error: error.message });
    }
}

async function editReview(req, res) {

}

async function deleteReview(req, res) {
    
}