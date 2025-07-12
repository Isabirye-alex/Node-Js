const db = require('./db.controller.js');

async function addAddress(req, res) { 
    try {
        const { user_id, address_line, district, region, country, postal_code } = req.body;
        if (!user_id || !address_line || !district || !region || !country) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if user exists
        const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Insert new address
        const [result] = await db.query('INSERT INTO addresses (user_id, address_line, district, region, country, postal_code) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, address_line, district, region, country, postal_code]);
        return res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: {
                id: result.insertId,
                user_id,
                address_line,
                district,
                region,
                country,
                postal_code
            }
        });
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }

}

async function getAddressesByUserId(req, res) {
    try {
        const { id } = req.params;
        // Check if user exists
        const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Get addresses for the user
        const [addressRows] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [id]);
        return res.status(200).json({
            success: true,
            data: addressRows        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    addAddress,
    getAddressesByUserId
}