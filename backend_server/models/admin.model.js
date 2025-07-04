const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;
const adminSchema = new Schema({
  firstName: { type: String, required: true },
  
    email: {type: String, required: true,  match: /.+\@.+\..+/,unique: true},
    userName: { type: String, required: true, unique: true}, 
     password: {type: String, required: true}
},
    {
    timestamps: true
}
);

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

const Admin = model('Admin', adminSchema);
module.exports = Admin;