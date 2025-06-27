
const express = require('express');
const router = express.Router();
const {  createProduct,  getAllProducts,  getProductById, updateProduct,deleteProduct, } = require('../controllers/product.controllers.js');


//Routes to handle all user funcions related to sub categories
router.get('/', getAllProducts);    // GET /categories
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);// POST /categories

module.exports = router;
