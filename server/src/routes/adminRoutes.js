const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Vacancy = require('../models/Vacancy');
const AdminAuditLog = require('../models/AdminAuditLog');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route GET /api/v1/admin/stats
 */
router.get('/stats', protect, authorize('admin', 'contentManager', 'contentReviewer'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const totalQuestions = await Question.countDocuments();
    const approvedQuestions = await Question.countDocuments({ validationStatus: 'approved' });
    const pendingReviewQuestions = await Question.countDocuments({ validationStatus: 'pending_review' });
    const totalQuizzes = await Quiz.countDocuments();
    const totalVacancies = await Vacancy.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        studentCount,
        totalQuestions,
        approvedQuestions,
        pendingReviewQuestions,
        totalQuizzes,
        totalVacancies,
        serverTime: new Date().toISOString(),
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime())
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/admin/config-status
 * Real environment configuration status without exposing any secrets
 */
router.get('/config-status', protect, authorize('admin'), (req, res) => {
  const providers = [
    {
      name: 'MongoDB Atlas',
      category: 'Database & Persistence',
      configured: Boolean(process.env.MONGODB_URI),
      required: true,
      keyName: 'MONGODB_URI',
      description: 'Primary cloud database connection for user profiles, quizzes, questions, and applications.'
    },
    {
      name: 'JWT Session Auth',
      category: 'Authentication',
      configured: Boolean(process.env.JWT_SECRET || process.env.SESSION_SECRET),
      required: true,
      keyName: 'JWT_SECRET',
      description: 'Cryptographic secret used to sign and verify student/admin session tokens.'
    },
    {
      name: 'Google OAuth 2.0',
      category: 'Social Authentication',
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      required: false,
      keyName: 'GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET',
      description: 'Enables real passwordless single sign-on via Google accounts.'
    },
    {
      name: 'GitHub OAuth 2.0',
      category: 'Social Authentication',
      configured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      required: false,
      keyName: 'GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET',
      description: 'Enables real passwordless single sign-on via GitHub developer accounts.'
    },
    {
      name: 'Gemini AI Intelligence',
      category: 'Generative AI & Reasoning',
      configured: Boolean(process.env.GEMINI_API_KEY),
      required: false,
      keyName: 'GEMINI_API_KEY',
      description: 'Powers live doubt solving, dynamic question generation, OCR image solving, and interview feedback.'
    },
    {
      name: 'Judge0 Sandboxed Code Runner',
      category: 'Code Execution Engine',
      configured: Boolean(process.env.JUDGE0_API_URL),
      required: false,
      keyName: 'JUDGE0_API_URL & JUDGE0_API_KEY',
      description: 'Executes untrusted user code (C, C++, Java, Python, JS) in an isolated sandbox.'
    },
    {
      name: 'YouTube Educational Data API',
      category: 'Learning Resources',
      configured: Boolean(process.env.YOUTUBE_API_KEY),
      required: false,
      keyName: 'YOUTUBE_API_KEY',
      description: 'Enables real-time live video searching across public educational channels.'
    },
    {
      name: 'Email & Notification Provider',
      category: 'Notifications',
      configured: Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY),
      required: false,
      keyName: 'RESEND_API_KEY or SMTP_HOST',
      description: 'Dispatches password reset instructions and milestone study reminders.'
    }
  ];

  res.json({
    success: true,
    environment: process.env.NODE_ENV || 'development',
    serverUptime: Math.floor(process.uptime()),
    providers
  });
});

/**
 * @route GET /api/v1/admin/audit-logs
 */
router.get('/audit-logs', protect, authorize('admin'), async (req, res, next) => {
  try {
    const logs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/admin/users
 */
router.get('/users', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/v1/admin/users/:id/role
 */
router.patch('/users/:id/role', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'contentManager', 'contentReviewer', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

    // Audit log
    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_USER_ROLE',
      targetEntity: 'User',
      targetId: req.params.id,
      details: { newRole: role, userEmail: user.email },
      ipAddress: req.ip || ''
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/admin/questions/pending
 */
router.get('/questions/pending', protect, authorize('admin', 'contentManager', 'contentReviewer'), async (req, res, next) => {
  try {
    const questions = await Question.find({ validationStatus: 'pending_review' }).limit(30);
    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/v1/admin/questions/:id/review
 */
router.patch('/questions/:id/review', protect, authorize('admin', 'contentManager', 'contentReviewer'), async (req, res, next) => {
  try {
    const { validationStatus, flaggedReason } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { validationStatus, flaggedReason, reviewedBy: req.user._id, reviewTimestamp: new Date() },
      { new: true }
    );

    // Audit log
    await AdminAuditLog.create({
      adminId: req.user._id,
      adminEmail: req.user.email,
      action: 'REVIEW_QUESTION',
      targetEntity: 'Question',
      targetId: req.params.id,
      details: { validationStatus, flaggedReason },
      ipAddress: req.ip || ''
    });

    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
