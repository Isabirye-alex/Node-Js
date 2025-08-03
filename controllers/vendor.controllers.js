const db = require('../controllers/db.controller.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function addNewVendor(req, res) {
    try {
        const { first_name, last_name, email, phone_number, product_categories, password } = req.body;

        if (!first_name || !last_name || !email || !phone_number || !product_categories || !password) {
            return res.status(409).json({ success: false, message: 'Required fields missing' });
        }

        const [existing_vendor] = await db.query(
            'SELECT * FROM vendors WHERE email = ? OR phone_number = ?',
            [email, phone_number]
        );

        if (existing_vendor.length > 0) {
            return res.status(409).json({ success: false, message: 'Vendor already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const categories = Array.isArray(product_categories)
            ? product_categories.join(",")
            : product_categories;


        const [insertResult] = await db.query(
            'INSERT INTO vendors (first_name, last_name, email, phone_number, product_categories, password) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, categories, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'New vendor added successfully',
            vendor: {
                id: insertResult.insertId,
                first_name,
                last_name,
                email,
                product_categories,
                phone_number,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating new vendor', error: error.message });
    }
}

async function vendorLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(409).json({ success: false, message: 'Both email and password are required' });
        }

        const [existingVendor] = await db.query('SELECT * FROM vendors WHERE email = ?', [email]);

        if (existingVendor.length === 0) {
            return res.status(404).json({ success: false, message: 'No vendor found with the provided email address' });
        }

        const vendor = existingVendor[0];

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid login credentials' });
        }

        const token = jwt.sign({ id: vendor.id, role: 'vendor' }, process.env.SECRET_ACCESS_TOKEN);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            vendor: {
                id: vendor.id,
                first_name: vendor.first_name,
                last_name: vendor.last_name,
                email: vendor.email,
                product_categories: vendor.product_categories,
                phone_number: vendor.phone_number,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error during login', error: error.message });
    }
}

async function deleteVendor(req, res) {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'No vendor found with the provided id' });
        }

        await db.query('DELETE FROM vendors WHERE id = ?', [id]);

        return res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting vendor', error: error.message });
    }
}

async function getVendorById(req, res) {
    try {
        const { id } = req.params;

        const [vendor] = await db.query('SELECT id, first_name, last_name, email, phone_number, product_categories FROM vendors WHERE id = ?', [id]);

        if (vendor.length === 0) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        return res.status(200).json({ success: true, vendor: vendor[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching vendor', error: error.message });
    }
}

async function getAllVendors(req, res) {
    try {
        const [vendors] = await db.query('SELECT id, first_name, last_name, email, phone_number, product_categories FROM vendors');

        return res.status(200).json({ success: true, vendors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching vendors', error: error.message });
    }
}


module.exports = {
    addNewVendor,
    vendorLogin,
    deleteVendor,
    getVendorById,
    getAllVendors
};
