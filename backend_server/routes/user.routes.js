const express = require('express');
const router = express.Router();
const {
  registerNewUser,
  userLogin
} = require('../controllers/user.controllers.js');

// Register user
router.post('/register', registerNewUser);

// Login user
router.post('/login', userLogin);

module.exports = router;
