const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  logoUrl: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Brand = model('Brand', brandSchema);
module.exports = Brand;
