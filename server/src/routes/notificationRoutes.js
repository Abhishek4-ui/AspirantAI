const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/notifications
 */
router.get('/', protect, async (req, res, next) => {
  try {
    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Provide default welcoming notifications if empty
    if (notifications.length === 0) {
      notifications = await Notification.create([
        {
          userId: req.user._id,
          title: 'Welcome to AspirantAI!',
          message: 'Your AI-powered destination for All-India competitive exams and board preparation is ready.',
          type: 'system',
          link: '/dashboard'
        },
        {
          userId: req.user._id,
          title: 'Daily 100-Question Grand Quiz is Live',
          message: 'Sharpen your speed and accuracy. Complete today’s test before midnight.',
          type: 'daily_quiz',
          link: '/daily-quiz'
        }
      ]);
    }

    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/v1/notifications/mark-read
 */
router.patch('/mark-read', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
