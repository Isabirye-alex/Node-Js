const express = require('express');
const router = express.Router();
const {addNewVendor, vendorLogin, deleteVendor,getAllVendors,getVendorById } = require('../controllers/vendor.controllers.js');
const { assignVendorRole, getVendorRoles } = require('../controllers/vendor.roles.controllers.js');
// Register admin
router.post('/add-vendor', addNewVendor);

// Login admin
router.post('/vendor-login', vendorLogin);

// Get all admins
router.get('/get-vendors', getAllVendors);

// Get admin by ID
router.get('/get-vendor:id', getVendorById);

// Delete admin by ID
router.delete('/:id', deleteVendor);

//Vendor roles routes
router.post("/:vendorId/roles", assignVendorRole);
router.get("/:vendorId/roles", getVendorRoles);


module.exports = router;
