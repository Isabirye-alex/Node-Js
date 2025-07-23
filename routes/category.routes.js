const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/category.controllers.js');
const upload = require('../config/multer.config.js'); 

//Routes to handle all user funcions related to categories
router.get('/', getAllCategories);    // GET /categories
router.post('/', upload.single('image'), createCategory);
router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);// POST /categories

module.exports = router;
