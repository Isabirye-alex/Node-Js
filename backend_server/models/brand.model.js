const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const brandSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  logoUrl: { type: String },
  description: { type: String },
  subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
    },
},
  {
  timestamps: true
});

const Brand = model('Brand', brandSchema);
module.exports = Brand;
