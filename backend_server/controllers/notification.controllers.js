const db = require('./db.controller.js');

async function createNotification(req, res) {
  try {
    const { userId, message, title, is_read = false, imageUrl, broadcast } = req.body;

    if (!message || !title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    if (broadcast) {
      // Send to ALL users
      const [users] = await db.query(`SELECT id FROM users`);
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'No users found to send notification' });
      }

      const values = users.map(user => [user.id, title, message, imageUrl, is_read]);
      await db.query(`
        INSERT INTO notifications (user_id, title, message, image_url, is_read)
        VALUES ?
      `, [values]);

      return res.status(201).json({
        success: true,
        message: `Notification sent to ${users.length} users`
      });
    }

    // Normal: send to one user
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required if not broadcasting' });
    }

    const [result] = await db.query(
      `INSERT INTO notifications (userId, title, message, image_url, is_read)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, message, imageUrl, is_read]
    );

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: {
        id: result.insertId,
        userId,
        title,
        message,
        imageUrl,
        is_read
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
}

async function getNotifications(req, res) {
  try {
    const [notifications] = await db.query(`
      SELECT n.*, u.username, u.email
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
    `);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update notification', error: error.message });
  }
}

async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM notifications WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notification', error: error.message });
  }
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
};