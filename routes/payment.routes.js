const express = require('express');
const router = express.Router();
const {     createPayment,
  getPayments,
  getPaymentById,
getPaymentMethods,
  deletePayment} = require('../controllers/payment.controllers.js');


//Routes to handle all user funcions related to categories
router.get('/', getPayments);    // GET /categories
router.post('/', createPayment);
router.get('/paymentmethods',getPaymentMethods);
router.get('/:id', getPaymentById);
router.delete('/:id', deletePayment);// POST /categories

module.exports = router;
