const express = require('express');
const router = express.Router();
const {   createNotification,
  getNotifications,
  markAsRead,
  deleteNotification } = require('../controllers/notification.controllers.js');
const upload = require('../config/notification.config.js');

//Routes to handle all user funcions related to categories
router.get('/', upload.single('image'),createNotification);    // GET /categories
router.post('/', getNotifications);
router.put('/:id', markAsRead);
router.delete('/:id', deleteNotification);// POST /categories

module.exports = router;
