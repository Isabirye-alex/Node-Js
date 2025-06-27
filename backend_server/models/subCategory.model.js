const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subcategorySchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Subcategory = model('Subcategory', subcategorySchema);
module.exports = Subcategory;
