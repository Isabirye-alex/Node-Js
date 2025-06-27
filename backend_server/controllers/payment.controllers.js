const Payment = require('../models/payment.model');

// Create Payment
async function createPayment(req, res) {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ success: true, message: 'Payment created', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
  }
}

// Get All Payments
async function getPayments(req, res) {
  try {
    const payments = await Payment.find().populate('user');
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
}

// Get Payment by ID
async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate('user');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get payment' });
  }
}

// Delete Payment
async function deletePayment(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment' });
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  deletePayment
};
