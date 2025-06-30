
const express = require('express');
const router = express.Router();
const { createBrand, getBrand, getBrandById, updateBrand, deleteBrand } = require('../controllers/brand.controllers.js');
const upload = require('./config/brand.config.js');

//Routes to handle all user funcions related to sub categories
router.get('/', getBrand);    // GET /categories
router.post('/',upload.single('image'), createBrand);
router.get('/:id', getBrandById);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);// POST /categories

module.exports = router;
