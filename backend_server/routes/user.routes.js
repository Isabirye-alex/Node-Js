const express = require('express');
const router = express.Router();
const {
  registerNewUser,
  userLogin, deleteUser, updateUser,getUsers
} = require('../controllers/user.controllers.js');

// Register user
router.post('/register', registerNewUser);

// Login user
router.post('/login', userLogin);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getUsers)

module.exports = router;
