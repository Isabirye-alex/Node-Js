const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerNewUser(req, res) {
  try {
    const { fullname, email, username, password, imageUrl } = req.body;

    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required except the image' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username or Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
      imageUrl
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User account successfully created',
      user: {
        id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        username: savedUser.username,
        imageUrl: savedUser.imageUrl
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to register new user', error: error.message });
  }
}

async function userLogin(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password does not match for username:", username);
      return res.status(400).json({ success: false, message: 'Invalid login credentials! Cross-check password and try again.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1d' });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullname: user.fullname
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed. Try again later.', error: error.message });
  }
}

module.exports = {
  registerNewUser,
  userLogin
};
