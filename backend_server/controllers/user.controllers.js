const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerNewUser(req, res) {
    try { 
        const { fullname, email, username, password, imageUrl } = req.body;
        if (!fullname || !email || !username || !password) {
            res.status(404).json({ success: false, message: 'All fields are required except the image' });
        }
        const existing = await User.findOne({ email: email, username: username });
        if (existing) {
            res.status(409).json({ success: false, message: 'Username or Email already registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullname, email, username, hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User account successfully created', date: User });
     
    } catch (error) {
        res.status(500).json({ success: false, message: 'Faild to register new user', error: error.message });
    }
}

async function userLogin(req, res) {
    try {
        const { username, password } = req.body;
        //Check if user exists
        const checkUserExistence = await User.findOne({ username });
        if (!checkUserExistence) {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        //Verify password
        const isMatch = await bcrypt.compare(password, checkUserExistence.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid log in credentials! cross check password and try again' });
        }
        //create token
        const token = await jwt.sign(id:checkUserExistence._id, )

     } catch (error) {
        
    }
}