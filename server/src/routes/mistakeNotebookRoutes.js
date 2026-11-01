const express = require('express');
const router = express.Router();
const MistakeNotebookEntry = require('../models/MistakeNotebookEntry');
const { protect, optionalProtect } = require('../middleware/auth');

/**
 * @route GET /api/v1/mistake-notebook
 */
router.get('/', optionalProtect, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ success: true, count: 0, entries: [] });
    }

    const { subject, isResolved } = req.query;
    const query = { userId: req.user._id };

    if (subject && subject !== 'All') query.subject = subject;
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';

    const entries = await MistakeNotebookEntry.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: entries.length, entries });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/mistake-notebook/add
 */
router.post('/add', protect, async (req, res, next) => {
  try {
    const { questionId, questionText, questionHindi, studentAnswer, correctAnswer, explanation, explanationHindi, subject, topic } = req.body;

    const entry = await MistakeNotebookEntry.create({
      userId: req.user._id,
      questionId,
      questionText,
      questionHindi,
      studentAnswer,
      correctAnswer,
      explanation,
      explanationHindi,
      subject: subject || 'General Knowledge',
      topic: topic || 'Core Concepts'
    });

    res.status(201).json({ success: true, entry });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/v1/mistake-notebook/:id/resolve
 */
router.patch('/:id/resolve', protect, async (req, res, next) => {
  try {
    const entry = await MistakeNotebookEntry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });

    entry.isResolved = !entry.isResolved;
    entry.lastReviewedAt = new Date();
    entry.reviewCount += 1;
    await entry.save();

    res.json({ success: true, entry });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/mistake-notebook/:id
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    await MistakeNotebookEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Removed from Mistake Notebook.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
