
const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/auth.controllers.js');


//Routes to handle all user funcions related to sub categories
router.get('/', createUser);    // GET /categories
router.post('/', loginUser);
// router.get('/:id', getBrandById);
// router.put('/:id', updateBrand);
// router.delete('/:id', deleteBrand);// POST /categories

module.exports = router;
