const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const posterSchema = new Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Poster = model('Poster', posterSchema);
module.exports = Poster;
