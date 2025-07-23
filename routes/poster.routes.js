const express = require('express');
const router = express.Router();
const {   createPoster,
  getPosters,
  getPosterById,
  deletePoster,
 } = require('../controllers/poster.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getPosters);    // GET /categories
router.post('/', createPoster);
router.get('/:id', getPosterById);
router.delete('/:id', deleteOrder);// POST /categories

module.exports = router;
