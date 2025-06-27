const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const subcategorySchema = new Schema({
  name: { type: String, required: true, trim: true , unique: true},
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: {type: String, trim: true}
});
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });
subcategorySchema.pre('save', function(next) {
  this.name = this.name.toLowerCase().trim();
  next();
});


const Subcategory = model('Subcategory', subcategorySchema);
module.exports = Subcategory;
