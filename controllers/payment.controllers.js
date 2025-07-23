const db = require('./db.controller.js');
const crypto = require('crypto');

// Generate unique transaction ID
function generateTransactionId() {
  return crypto.randomBytes(8).toString('hex'); // 16-char unique ID
}

// Create Payment
async function createPayment(req, res) {
  try {
    const { user_id, amount, currency, payment_method, status } = req.body;

    if (!user_id || !amount || !currency || !payment_method || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const transaction_id = generateTransactionId();

    const [result] = await db.query(
      `INSERT INTO payments (user_id, amount, currency, payment_method, status, transaction_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, amount, currency, payment_method, status, transaction_id]
    );

    res.status(201).json({
      success: true,
      message: 'Payment created',
      data: {
        id: result.insertId,
        user_id,
        amount,
        currency,
        payment_method,
        status,
        transaction_id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
  }
}

// Get All Payments
async function getPayments(req, res) {
  try {
    const [payments] = await db.query(`
      SELECT payments.*, users.name AS user_name
      FROM payments
      JOIN users ON payments.user_id = users.id
    `);

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
  }
}

// Get Payment by ID
async function getPaymentById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT payments.*, users.name AS user_name
      FROM payments
      JOIN users ON payments.user_id = users.id
      WHERE payments.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get payment', error: error.message });
  }
}

// Delete Payment
async function deletePayment(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM payments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment', error: error.message });
  }
}

async function getPaymentMethods(req, res) {
  try {
    const [rows] = await db.query(`
      SHOW COLUMNS FROM orders LIKE 'payment_method'
    `);

    const enumStr = rows[0].Type; // e.g., enum('cash_on_delivery','mobile_money','card')

    const values = enumStr
      .replace("enum(", "")
      .replace(")", "")
      .split(",")
      .map(v => v.replace(/'/g, ""));

    return res.status(200).json({
      success: true,
      paymentMethods: values,
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
    });
  }
}


module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  deletePayment,
getPaymentMethods
};
