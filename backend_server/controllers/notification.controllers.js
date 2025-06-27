const Notification = require('../models/notification.model');

// Create Notification
async function createNotification(req, res) {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create notification', error: error.message });
  }
}

// Get All Notifications
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find().populate('user');
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
}

// Mark Notification as Read
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Notification marked as read', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
}

// Delete Notification
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notification' });
  }
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
};
