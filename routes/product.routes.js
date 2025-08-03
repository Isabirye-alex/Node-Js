
const express = require('express');
const router = express.Router();
const {  createProduct,getFeaturedProducts,  getAllProducts,  getProductById, updateProduct,deleteProduct,searchProducts } = require('../controllers/product.controllers.js');
const upload = require('../config/product.config.js');

router.get('/', getAllProducts);
 router.get('/featured', getFeaturedProducts);
router.post('/',upload.single('image'), createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/search', searchProducts)

module.exports = router;
