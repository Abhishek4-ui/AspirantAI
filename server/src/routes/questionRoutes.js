const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect, authorize } = require('../middleware/auth');
const { generateQuestions } = require('../services/aiQuestionEngine');

/**
 * @route GET /api/v1/questions
 * Filter questions with pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      examCategory,
      subject,
      topic,
      difficulty,
      language,
      questionType,
      generationMethod,
      sourceType,
      year,
      page = 1,
      limit = 20
    } = req.query;

    const query = { validationStatus: 'approved' };

    if (examCategory && examCategory !== 'All') query.examCategory = examCategory;
    if (subject && subject !== 'All') query.subject = subject;
    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (language && language !== 'All') query.language = language;
    if (questionType && questionType !== 'All') query.questionType = questionType;
    if (generationMethod) query.generationMethod = generationMethod;
    if (sourceType) query.sourceType = sourceType;
    if (year) query.examinationYear = Number(year);

    const skip = (Number(page) - 1) * Number(limit);
    const [questions, total] = await Promise.all([
      Question.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Question.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: questions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      questions
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/questions/generate
 * Central AI Question Engine generator endpoint
 */
router.post('/generate', protect, async (req, res, next) => {
  try {
    const {
      examCategory,
      examCode,
      subject,
      topic,
      difficulty,
      language,
      questionType,
      count
    } = req.body;

    const result = await generateQuestions({
      examCategory,
      examCode,
      subject,
      topic,
      difficulty,
      language,
      questionType,
      count
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/questions/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/questions
 * Create manual verified question (Admin / Content Reviewer)
 */
router.post('/', protect, authorize('admin', 'contentManager', 'contentReviewer'), async (req, res, next) => {
  try {
    const question = await Question.create({
      ...req.body,
      generationMethod: req.body.generationMethod || 'human_curated',
      isAiGenerated: req.body.isAiGenerated || false,
      reviewedBy: req.user._id,
      reviewTimestamp: new Date()
    });
    res.status(201).json({ success: true, question });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/v1/questions/:id
 */
router.patch('/:id', protect, authorize('admin', 'contentManager', 'contentReviewer'), async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { ...req.body, reviewedBy: req.user._id, reviewTimestamp: new Date() },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
