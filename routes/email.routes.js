const express = require('express');
const router = express.Router();

const { sendWelcomeEmail, sendOrderEmail } = require('../controllers/mailer/email.controller.js');

router.post('/welcomeEmail', sendWelcomeEmail);
router.post('/order-placement', sendOrderEmail);
module.exports = router;