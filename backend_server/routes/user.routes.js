const express = require('express');
const router = express.Router();
const {
  registerNewUser,
  userLogin, deleteUser, updateUser,getUsers
} = require('../controllers/user.controllers.js');
const upload = require('../config/users.config.js');

// Register user
router.post('/register', upload.single('image'),registerNewUser);

// Login user
router.post('/login', userLogin);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getUsers)

module.exports = router;
