const jwt = require('jsonwebtoken');
function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ success: false, message: 'Access denied' });
    }
    try { 
        const verified = jwt.verify(token.replace('Bearer', ""), process.env.SECRET_ACCESS_TOKEN);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid token', error: error.message });
    }
}

module.exports = auth;