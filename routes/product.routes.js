
const express = require('express');
const router = express.Router();
const {  createProduct,getFeaturedProducts,  getAllProducts,  getProductById, updateProduct,deleteProduct,searchProducts, getProductsByCategoryId ,getHotSaleProducts,getSummerSaleProducts} = require('../controllers/product.controllers.js');
const upload = require('../config/product.config.js');

router.get('/', getAllProducts);
 router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategoryId);
router.post('/',upload.single('image'), createProduct);
router.get('/summer-sale', getSummerSaleProducts);
router.get('/hot-sale', getHotSaleProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
module.exports = router;
