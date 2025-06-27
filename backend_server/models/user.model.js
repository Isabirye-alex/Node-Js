const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  
const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, match: /.+\@.+\..+/ },
  userName: { type: String, required: true, trim: true, unique: true },  
  password: { type: String, required: true, trim: true },               
  imageUrl: { type: String },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = model('User', userSchema);
module.exports = User;
