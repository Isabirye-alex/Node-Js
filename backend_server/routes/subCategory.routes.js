const express = require('express');
const router = express.Router();
const {createSubCategory,deleteSubCategory,updateSubCategory,getSubCategory,getSubCategoryById } = require('../controllers/subCategory.controllers.js');
const upload = require('../config/subcategory.config.js');  

//Routes to handle all user funcions related to sub categories
router.get('/', getSubCategory);    // GET /categories
router.post('/',upload.single('image'), createSubCategory);
router.get('/:id', getSubCategoryById);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);// POST /categories

module.exports = router;
