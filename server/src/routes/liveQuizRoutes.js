const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const LiveQuizSession = require('../models/LiveQuizSession');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/live-quiz/sessions
 */
router.get('/sessions', async (req, res, next) => {
  try {
    const sessions = await LiveQuizSession.find({ status: { $ne: 'finished' } })
      .populate('quizId', 'title totalQuestions')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions: sessions.map(s => ({
        roomCode: s.roomCode,
        title: s.title,
        status: s.status,
        participantsCount: s.participants.filter(p => p.connected).length,
        quizTitle: s.quizId ? s.quizId.title : 'Live Challenge'
      }))
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/live-quiz/create
 */
router.post('/create', protect, async (req, res, next) => {
  try {
    const { title, quizId } = req.body;

    let targetQuizId = quizId;
    if (!targetQuizId) {
      const defaultQuiz = await Quiz.findOne({ isDaily: true });
      targetQuizId = defaultQuiz ? defaultQuiz._id : null;
    }

    if (!targetQuizId) {
      return res.status(400).json({ success: false, message: 'Valid Quiz ID required to host live quiz.' });
    }

    const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const session = await LiveQuizSession.create({
      roomCode,
      title: title || 'All-India Live Speed Challenge',
      quizId: targetQuizId,
      hostId: req.user._id,
      status: 'waiting',
      participants: [{
        userId: req.user._id,
        name: req.user.name,
        score: 0,
        connected: true
      }]
    });

    res.status(201).json({
      success: true,
      roomCode: session.roomCode,
      session
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/live-quiz/:roomCode
 */
router.get('/:roomCode', async (req, res, next) => {
  try {
    const session = await LiveQuizSession.findOne({ roomCode: req.params.roomCode.toUpperCase() })
      .populate('quizId', 'title totalQuestions durationMinutes');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
