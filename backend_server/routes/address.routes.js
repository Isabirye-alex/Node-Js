const express = require('express');
const router = express.Router();
const {
    addAddress,
    getAddressesByUserId

} = require('../controllers/address.controllers.js');

// Register admin
router.post('/addaddress', addAddress);


// Get admin by ID
router.get('/:id', getAddressesByUserId);

// Delete admin by ID
// router.delete('/:id', deleteAdmin);

module.exports = router;
