const express = require('express');
const router = express.Router();
const ExamCalendarEvent = require('../models/ExamCalendarEvent');
const { protect, JWT_SECRET } = require('../middleware/auth');

/**
 * @route GET /api/v1/calendar
 * Get official dates and user reminders
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, month, year } = req.query;
    let userId = null;

    // Optional auth token check for private user reminders
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {
        // Continue as public unauthenticated query
      }
    }

    const query = {
      $or: [
        { isOfficial: true },
        ...(userId ? [{ userId: userId }] : [])
      ]
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      query.eventDate = { $gte: startDate, $lte: endDate };
    }

    const events = await ExamCalendarEvent.find(query).sort({ eventDate: 1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/calendar
 * Create a personal reminder or admin official date
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, hindiTitle, category, eventType, eventDate, endDate, officialNotificationUrl, notes, isOfficial } = req.body;

    if (!title || !category || !eventType || !eventDate) {
      return res.status(400).json({ success: false, message: 'Title, category, event type, and date are required.' });
    }

    const canCreateOfficial = (req.user.role === 'admin' || req.user.role === 'contentManager') && isOfficial;

    const newEvent = await ExamCalendarEvent.create({
      userId: canCreateOfficial ? null : req.user._id,
      title,
      hindiTitle: hindiTitle || '',
      category,
      eventType,
      eventDate: new Date(eventDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isOfficial: Boolean(canCreateOfficial),
      verificationStatus: canCreateOfficial ? 'confirmed' : 'tentative',
      officialNotificationUrl: officialNotificationUrl || '',
      notes: notes || '',
      source: canCreateOfficial ? 'AspirantAI Official Gazette Registry' : 'Personal User Goal'
    });

    res.status(201).json({
      success: true,
      message: 'Event added to calendar.',
      event: newEvent
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/calendar/:id
 * Delete user reminder
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const event = await ExamCalendarEvent.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        ...(req.user.role === 'admin' ? [{ isOfficial: true }] : [])
      ]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found or unauthorized.' });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Calendar event deleted.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
