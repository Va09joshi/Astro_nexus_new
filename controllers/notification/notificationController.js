// controllers/users/notificationController.js
import Notification from "../../models/notification/Notification.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create system notification (Admin)
export const createNotification = async (req, res) => {
  const { userId, type, title, message } = req.body;
  try {
    const notification = new Notification({ userId, type, title, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};