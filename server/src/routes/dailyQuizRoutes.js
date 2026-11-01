/**
 * AspirantAI — Daily AI Quiz API (100 Questions)
 * Generates and serves 100-question AI quizzes per examination category, syllabus & language (Asia/Kolkata).
 * Persists in-progress attempts so browser refresh restores answers and timer countdown.
 */

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Question = require('../models/Question');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');
const questionEngine = require('../services/questionEngine');
const { getExamBlueprint, calculateDynamicDuration, getAllSupportedExams } = require('../services/questionEngine/syllabusRegistry');

/**
 * @route GET /api/v1/daily-quiz/catalog
 * Get full catalog of supported examinations for Daily AI Quiz
 */
router.get('/catalog', (req, res) => {
  const exams = getAllSupportedExams();
  res.json({
    success: true,
    count: exams.length,
    exams
  });
});

/**
 * @route GET /api/v1/daily-quiz/today
 * Fetch today's 100-question daily quiz for selected exam category
 * Restores user active attempt or completed result if authenticated
 */
router.get('/today', async (req, res, next) => {
  try {
    const { examCode = 'UPSC_CSE', language = 'en', force = 'false' } = req.query;
    const blueprint = getExamBlueprint(examCode);
    const todayDateStr = questionEngine.getKolkataDateString();
    const isForce = force === 'true' || force === true;

    const quizTitle = `All-India Daily Grand Quiz (${blueprint.name}) - ${todayDateStr}`;

    // 1. Find or dynamically assemble today's quiz
    let quiz = null;
    if (!isForce) {
      quiz = await Quiz.findOne({
        isDaily: true,
        examCode: blueprint.code,
        title: { $regex: todayDateStr }
      }).populate('questions');
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0 || isForce) {
      // Find existing questions matching this exam
      const existingPool = isForce ? [] : await Question.find({
        $or: [
          { examCode: blueprint.code },
          { examCategory: blueprint.category }
        ],
        validationStatus: 'approved'
      });

      // Assemble or generate questions via Dynamic Question Engine (Live API prioritized)
      let assembled = null;
      try {
        assembled = await questionEngine.generateCompleteTest({
          examCode: blueprint.code,
          targetCount: isForce ? 15 : 100,
          language,
          difficulty: 'medium',
          existingQuestionPool: existingPool,
          forceLiveApi: isForce
        });
      } catch (engineErr) {
        console.warn('[Daily Quiz] Engine assembly fallback:', engineErr.message);
        assembled = {
          blueprint,
          questions: existingPool.slice(0, 100)
        };
      }

      // Save any newly generated questions into MongoDB Question collection
      const questionDocs = [];
      for (const q of assembled.questions) {
        if (q.id) {
          const doc = await Question.findById(q.id);
          if (doc) {
            questionDocs.push(doc);
            continue;
          }
        }
        const created = await Question.create({
          questionText: q.questionText,
          questionHindi: q.questionHindi || q.questionText,
          options: q.options,
          optionsHindi: q.optionsHindi || q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          explanationHindi: q.explanationHindi || q.explanation,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty || 'medium',
          marks: q.marks || blueprint.positiveMarks,
          negativeMarks: q.negativeMarks !== undefined ? q.negativeMarks : blueprint.negativeMarks,
          examCategory: blueprint.category,
          examCode: blueprint.code,
          source: q.source || 'AspirantAI Daily AI Engine',
          sourceType: q.sourceType || 'ai_generated',
          validationStatus: 'approved'
        });
        questionDocs.push(created);
      }

      const timing = calculateDynamicDuration(blueprint.code, questionDocs.length);

      if (!quiz) {
        quiz = await Quiz.create({
          title: quizTitle,
          hindiTitle: `अखिल भारतीय दैनिक महा-क्विज़ (${blueprint.name}) - ${todayDateStr}`,
          description: `Comprehensive ${questionDocs.length}-Question All-India AI-generated & verified assessment for ${blueprint.name}.`,
          hindiDescription: `${blueprint.name} के लिए व्यापक ${questionDocs.length} प्रश्नों का अखिल भारतीय दैनिक अभ्यास मूल्यांकन।`,
          examCategory: blueprint.category,
          examCode: blueprint.code,
          totalQuestions: questionDocs.length,
          durationMinutes: timing.durationMinutes,
          positiveMarks: blueprint.positiveMarks,
          negativeMarks: blueprint.negativeMarks,
          isDaily: true,
          questions: questionDocs.map(q => q._id),
          scheduledFor: new Date(),
          publishStatus: 'published'
        });
      } else {
        quiz.questions = questionDocs.map(q => q._id);
        quiz.totalQuestions = questionDocs.length;
        quiz.durationMinutes = timing.durationMinutes;
        await quiz.save();
      }

      quiz = await Quiz.findById(quiz._id).populate('questions');
    }

    // Strip answers and full explanations to prevent client leakage before submission
    const secureQuestions = (quiz.questions || []).map((q, idx) => ({
      index: idx + 1,
      id: q._id.toString(),
      questionText: q.questionText,
      questionHindi: q.questionHindi,
      options: q.options,
      optionsHindi: q.optionsHindi,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
      marks: q.marks || quiz.positiveMarks,
      negativeMarks: q.negativeMarks !== undefined ? q.negativeMarks : quiz.negativeMarks,
      source: q.source
    }));

    // Dynamic duration recalculated strictly according to actual question count
    const dynamicTiming = calculateDynamicDuration(blueprint.code, secureQuestions.length);
    if (quiz.durationMinutes !== dynamicTiming.durationMinutes || quiz.totalQuestions !== secureQuestions.length) {
      quiz.durationMinutes = dynamicTiming.durationMinutes;
      quiz.totalQuestions = secureQuestions.length;
      await quiz.save();
    }

    // Check if user is authenticated via Authorization header to restore in-progress attempt
    let activeAttempt = null;
    let completedAttempt = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded?.id) {
          const attempt = await QuizAttempt.findOne({
            quizId: quiz._id,
            userId: decoded.id
          }).sort({ createdAt: -1 });

          if (attempt) {
            if (attempt.isCompleted) {
              completedAttempt = attempt;
            } else {
              activeAttempt = {
                attemptId: attempt._id,
                savedAnswers: attempt.savedAnswers ? Object.fromEntries(attempt.savedAnswers) : {},
                markedForReviewList: attempt.markedForReviewList || [],
                timeLeftSeconds: attempt.timeLeftSeconds || (quiz.durationMinutes * 60),
                currentIndex: attempt.currentIndex || 0
              };
            }
          }
        }
      } catch (authErr) {
        // Guest user browsing questions
      }
    }

    res.json({
      success: true,
      quiz: {
        id: quiz._id,
        title: quiz.title,
        hindiTitle: quiz.hindiTitle,
        description: quiz.description,
        hindiDescription: quiz.hindiDescription,
        examCategory: quiz.examCategory,
        examCode: quiz.examCode,
        totalQuestions: secureQuestions.length,
        durationMinutes: dynamicTiming.durationMinutes,
        secondsPerQuestion: dynamicTiming.secondsPerQuestion,
        totalDurationSeconds: dynamicTiming.totalSeconds,
        positiveMarks: quiz.positiveMarks,
        negativeMarks: quiz.negativeMarks,
        scheduledFor: quiz.scheduledFor,
        questions: secureQuestions
      },
      activeAttempt,
      completedAttempt: completedAttempt ? {
        attemptId: completedAttempt._id,
        score: completedAttempt.score,
        maxPossibleScore: completedAttempt.maxPossibleScore,
        accuracyPercentage: completedAttempt.accuracyPercentage,
        totalCorrect: completedAttempt.totalCorrect,
        totalWrong: completedAttempt.totalWrong,
        totalUnanswered: completedAttempt.totalUnanswered,
        submittedAt: completedAttempt.submittedAt
      } : null
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/daily-quiz/attempt/progress
 * Real-time progress saver: persists answers, marked list, and timer remaining
 */
router.put('/attempt/progress', protect, async (req, res, next) => {
  try {
    const { quizId, answers, markedForReviewList, timeLeftSeconds, currentIndex } = req.body;

    if (!quizId) {
      return res.status(400).json({ success: false, message: 'quizId is required.' });
    }

    let attempt = await QuizAttempt.findOne({
      quizId,
      userId: req.user._id,
      isCompleted: false
    });

    if (!attempt) {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }
      attempt = await QuizAttempt.create({
        quizId,
        userId: req.user._id,
        startedAt: new Date(),
        isCompleted: false,
        timeLeftSeconds: timeLeftSeconds || (quiz.durationMinutes * 60),
        currentIndex: currentIndex || 0,
        savedAnswers: answers || {},
        markedForReviewList: markedForReviewList || []
      });
    } else {
      if (answers) attempt.savedAnswers = answers;
      if (markedForReviewList) attempt.markedForReviewList = markedForReviewList;
      if (timeLeftSeconds !== undefined) attempt.timeLeftSeconds = timeLeftSeconds;
      if (currentIndex !== undefined) attempt.currentIndex = currentIndex;
      await attempt.save();
    }

    res.json({
      success: true,
      message: 'Progress saved successfully.',
      attemptId: attempt._id
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/daily-quiz/:id/submit
 * Server-authoritative scoring & submission
 */
router.post('/:id/submit', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { responses, answers, timeSpentSeconds } = req.body;

    const quiz = await Quiz.findById(id).populate('questions');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Ensure idempotency: if already submitted, return result
    let attempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId: req.user._id
    });

    if (attempt && attempt.isCompleted) {
      return res.status(200).json({
        success: true,
        message: 'This quiz was already submitted.',
        attemptId: attempt._id,
        score: attempt.score,
        maxPossibleScore: attempt.maxPossibleScore,
        accuracyPercentage: attempt.accuracyPercentage,
        totalCorrect: attempt.totalCorrect,
        totalWrong: attempt.totalWrong,
        totalUnanswered: attempt.totalUnanswered,
        alreadySubmitted: true
      });
    }

    const answersMap = answers || (responses ? Object.fromEntries(responses.map(r => [r.questionId, r.selectedAnswer])) : {});
    const qMap = new Map();
    quiz.questions.forEach(q => qMap.set(q._id.toString(), q));

    let score = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnanswered = 0;
    const scoredResponses = [];
    const topicStats = {};

    quiz.questions.forEach(q => {
      const qId = q._id.toString();
      const selected = answersMap[qId] || null;
      const topic = q.topic || q.subject || 'General';

      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0, wrong: 0 };
      }
      topicStats[topic].total += 1;

      if (!selected) {
        totalUnanswered += 1;
        scoredResponses.push({
          questionId: q._id,
          selectedAnswer: null,
          isCorrect: false,
          marksAwarded: 0
        });
      } else if (String(selected).toUpperCase() === String(q.correctAnswer).toUpperCase()) {
        totalCorrect += 1;
        score += quiz.positiveMarks;
        topicStats[topic].correct += 1;
        scoredResponses.push({
          questionId: q._id,
          selectedAnswer: selected,
          isCorrect: true,
          marksAwarded: quiz.positiveMarks
        });
      } else {
        totalWrong += 1;
        score -= quiz.negativeMarks;
        topicStats[topic].wrong += 1;
        scoredResponses.push({
          questionId: q._id,
          selectedAnswer: selected,
          isCorrect: false,
          marksAwarded: -quiz.negativeMarks
        });
      }
    });

    const topicBreakdown = Object.keys(topicStats).map(topic => ({
      topic,
      total: topicStats[topic].total,
      correct: topicStats[topic].correct,
      wrong: topicStats[topic].wrong,
      accuracy: topicStats[topic].total > 0
        ? Math.round((topicStats[topic].correct / topicStats[topic].total) * 100)
        : 0
    }));

    const totalAnswered = totalCorrect + totalWrong;
    const accuracyPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const finalScore = Math.max(0, Math.round(score * 100) / 100);

    if (!attempt) {
      attempt = await QuizAttempt.create({
        quizId: quiz._id,
        userId: req.user._id,
        submittedAt: new Date(),
        isCompleted: true,
        timeSpentSeconds: timeSpentSeconds || 0,
        responses: scoredResponses,
        score: finalScore,
        maxPossibleScore: quiz.questions.length * quiz.positiveMarks,
        accuracyPercentage,
        totalCorrect,
        totalWrong,
        totalUnanswered,
        topicBreakdown
      });
    } else {
      attempt.submittedAt = new Date();
      attempt.isCompleted = true;
      attempt.timeSpentSeconds = timeSpentSeconds || 0;
      attempt.responses = scoredResponses;
      attempt.score = finalScore;
      attempt.maxPossibleScore = quiz.questions.length * quiz.positiveMarks;
      attempt.accuracyPercentage = accuracyPercentage;
      attempt.totalCorrect = totalCorrect;
      attempt.totalWrong = totalWrong;
      attempt.totalUnanswered = totalUnanswered;
      attempt.topicBreakdown = topicBreakdown;
      await attempt.save();
    }

    // Award XP and update user learning telemetry
    const user = await User.findById(req.user._id);
    if (user) {
      user.xp += Math.round(finalScore * 10) + 50;
      user.stats.quizzesAttempted += 1;
      user.stats.totalQuestionsAnswered += totalAnswered;
      user.stats.totalCorrect += totalCorrect;
      user.stats.averageAccuracy = Math.round(
        (user.stats.totalCorrect / Math.max(1, user.stats.totalQuestionsAnswered)) * 100
      );
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Quiz submitted and evaluated successfully.',
      attemptId: attempt._id,
      score: finalScore,
      maxPossibleScore: attempt.maxPossibleScore,
      accuracyPercentage,
      totalCorrect,
      totalWrong,
      totalUnanswered,
      topicBreakdown
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/daily-quiz/attempt/:attemptId/results
 * Full result review with answer keys and conceptual explanations
 */
router.get('/attempt/:attemptId/results', protect, async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quizId')
      .populate('responses.questionId');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    if (attempt.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    res.json({
      success: true,
      attempt
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/daily-quiz/history
 * Historical quiz attempts for the authenticated student
 */
router.get('/history', protect, async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      isCompleted: true
    })
      .populate('quizId', 'title hindiTitle examCategory examCode totalQuestions positiveMarks negativeMarks')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      success: true,
      count: attempts.length,
      history: attempts
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
