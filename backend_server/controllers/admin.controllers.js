const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Admin
async function createAdmin(req, res) {
  try {
    const { fullName, email, userName, password } = req.body;
    if (!fullName || !email || !userName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Admin.findOne({ $or: [{ email }, { userName }] });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Admin already exists with this email or username' });
    }

    const admin = new Admin({ fullName, email, userName, password });
    await admin.save();

    res.status(201).json({ success: true, message: 'Admin registered successfully', data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin', error: error.message });
  }
}

// Admin Login
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, message: 'Login successful', token, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login error', error: error.message });
  }
}

// Get All Admins
async function getAdmins(req, res) {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admins' });
  }
}

// Get Admin by ID
async function getAdminById(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving admin' });
  }
}

// Delete Admin
async function deleteAdmin(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting admin' });
  }
}

module.exports = {
  createAdmin,
  adminLogin,
  getAdmins,
  getAdminById,
  deleteAdmin
};
