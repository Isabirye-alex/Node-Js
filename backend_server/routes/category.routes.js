const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/category.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getAllCategories);    // GET /categories
router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategoryById);
router.delete('/:id', deleteCategoryById);// POST /categories

module.exports = router;
