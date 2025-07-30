const express = require('express');
const router = express.Router();

const { sendWelcomeEmail, sendOrderEmail ,sendTestEmail} = require('../controllers/mailer/email.controller.js');

router.post('/welcome-email', sendWelcomeEmail);
router.post('/order-placement', sendOrderEmail);


module.exports = router;