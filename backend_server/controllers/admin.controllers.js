const db = require('../controllers/db.controller.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Admin
async function createAdmin(req, res) {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const imageUrl = req.file?.path; // Optional image upload
    if (!firstName || !lastName||!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields except image are required' });
    }

    const [existing] = await db.query(
      'SELECT * FROM admin WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO admin (firstName, lastName, email, username, password, imageUrl) VALUES (?, ?, ?,?, ?, ?)',
      [firstName,lastName, email, username, imageUrl,hashedPassword|| null]
    );

    res.status(201).json({ success: true, message: 'Admin account successfully created' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register admin', error: error.message });
  }
}

// Login Admin
async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const [adminRows] = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    const admin = adminRows[0];

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.SECRET_ACCESS_TOKEN);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        username: admin.username,
        imageUrl: admin.imageUrl
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
}

// Get all admins
async function getAdmins(req, res) {
  try {
    const [admins] = await db.query('SELECT * FROM admin');
    if (![admins] > 0) {
      res.status(404).json({success:false, message:'No admins found'})
    }
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admins', error: error.message });
  }
}

// Get admin by ID
async function getAdminById(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query('SELECT * FROM admin WHERE id = ?', [id]);
    const admin = result[0];
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving admin', error: error.message });
  }
}

// Delete admin
async function deleteAdmin(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM admin WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting admin', error: error.message });
  }
}

module.exports = {
  createAdmin,
  adminLogin,
  getAdmins,
  getAdminById,
  deleteAdmin
};
