
const express = require('express');
const router = express.Router();
const {  createProduct,getFeaturedProducts,  getAllProducts,  getProductById, updateProduct,deleteProduct, } = require('../controllers/product.controllers.js');
const upload = require('../config/product.config.js');

router.get('/', getAllProducts);
 router.get('/featured', getFeaturedProducts);
router.post('/',upload.single('image'), createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
