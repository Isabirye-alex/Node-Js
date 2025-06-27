const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const Category = model('Category', categorySchema);

module.exports = Category;