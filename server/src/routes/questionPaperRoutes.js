const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

/**
 * @route POST /api/v1/question-paper/generate
 * Custom Question Paper Generator
 */
router.post('/generate', protect, async (req, res, next) => {
  try {
    const {
      examCategory,
      subject,
      topic,
      difficulty,
      questionCount = 25,
      language = 'en',
      positiveMarks = 2,
      negativeMarks = 0.5,
      durationMinutes = 45
    } = req.body;

    const query = { validationStatus: 'approved' };
    if (examCategory && examCategory !== 'All') query.examCategory = examCategory;
    if (subject && subject !== 'All') query.subject = subject;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;

    let questions = await Question.find(query).limit(Number(questionCount));

    // If not enough match exact subject, supplement from category
    if (questions.length < Number(questionCount)) {
      const more = await Question.find({
        _id: { $nin: questions.map(q => q._id) },
        validationStatus: 'approved'
      }).limit(Number(questionCount) - questions.length);
      questions = [...questions, ...more];
    }

    res.json({
      success: true,
      paperMetadata: {
        title: `Custom Practice Paper: ${subject || examCategory || 'General'}`,
        subject: subject || 'General Knowledge',
        difficulty: difficulty || 'mixed',
        totalQuestions: questions.length,
        durationMinutes,
        totalMarks: questions.length * positiveMarks,
        positiveMarks,
        negativeMarks,
        language
      },
      questions: questions.map((q, idx) => ({
        index: idx + 1,
        id: q._id,
        questionText: language === 'hi' && q.questionHindi ? q.questionHindi : q.questionText,
        options: language === 'hi' && q.optionsHindi?.length === 4 ? q.optionsHindi : q.options,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        correctAnswer: q.correctAnswer, // Included in paper generator for teachers/self-test preview
        explanation: language === 'hi' && q.explanationHindi ? q.explanationHindi : q.explanation
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
