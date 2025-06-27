const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdminById,
  deleteAdmin,
  adminLogin
} = require('../controllers/admin.controllers.js');

// Register admin
router.post('/register', createAdmin);

// Login admin
router.post('/login', adminLogin);

// Get all admins
router.get('/', getAdmins);

// Get admin by ID
router.get('/:id', getAdminById);

// Delete admin by ID
router.delete('/:id', deleteAdmin);

module.exports = router;
