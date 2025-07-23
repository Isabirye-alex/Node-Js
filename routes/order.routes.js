const express = require('express');
const router = express.Router();
const {     createOrder,
    getOrders,
    getOrderByUserId,
    getOrderItems,
    updateOrder,
    deleteOrder } = require('../controllers/order.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getOrders);    // GET /categories
router.post('/', createOrder);
router.get('/orderitems/:orderId', getOrderItems); // GET /categories/:id
router.get('/user/:userId', getOrderByUserId);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);// POST /categories

module.exports = router;
