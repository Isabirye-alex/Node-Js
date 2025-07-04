const express = require('express');
const router = express.Router();
const {     createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder } = require('../controllers/order.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getOrders);    // GET /categories
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);// POST /categories

module.exports = router;
