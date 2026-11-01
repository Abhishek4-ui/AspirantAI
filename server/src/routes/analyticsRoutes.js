const express = require('express');
const router = express.Router();
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/analytics/overview
 */
router.get('/overview', protect, async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id, isCompleted: true })
      .sort({ createdAt: -1 })
      .limit(20);

    const totalQuizzes = attempts.length;
    let totalScore = 0;
    let totalMaxScore = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalTimeSpent = 0;
    const topicAggregates = {};

    attempts.forEach(att => {
      totalScore += att.score || 0;
      totalMaxScore += att.maxPossibleScore || 0;
      totalQuestions += (att.totalCorrect + att.totalWrong + att.totalUnanswered) || 0;
      totalCorrect += att.totalCorrect || 0;
      totalWrong += att.totalWrong || 0;
      totalTimeSpent += att.timeSpentSeconds || 0;

      (att.topicBreakdown || []).forEach(tb => {
        if (!topicAggregates[tb.topic]) {
          topicAggregates[tb.topic] = { total: 0, correct: 0, wrong: 0 };
        }
        topicAggregates[tb.topic].total += tb.total;
        topicAggregates[tb.topic].correct += tb.correct;
        topicAggregates[tb.topic].wrong += tb.wrong;
      });
    });

    const averageAccuracy = (totalCorrect + totalWrong) > 0
      ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
      : (req.user.stats?.averageAccuracy || 0);

    const averageScorePercent = totalMaxScore > 0
      ? Math.round((totalScore / totalMaxScore) * 100)
      : 0;

    // Calculate transparent Readiness Indicator
    // Factors: Average accuracy (40%), Quiz consistency (30%), Topic breadth (30%)
    const readinessScore = Math.min(
      95,
      Math.round(
        (averageAccuracy * 0.45) +
        (Math.min(totalQuizzes * 10, 30)) +
        (Math.min(Object.keys(topicAggregates).length * 5, 25))
      )
    );

    // Recent attempts trend for charts
    const performanceTrend = attempts.slice(0, 7).reverse().map((att, i) => ({
      quizNumber: `#${i + 1}`,
      date: new Date(att.submittedAt || att.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      score: att.score,
      accuracy: att.accuracyPercentage
    }));

    // Weak and Strong topics
    const topicPerformance = Object.keys(topicAggregates).map(topic => {
      const agg = topicAggregates[topic];
      const acc = agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0;
      return {
        topic,
        total: agg.total,
        accuracy: acc,
        status: acc >= 70 ? 'Strong' : acc >= 45 ? 'Moderate' : 'Needs Practice'
      };
    });

    res.json({
      success: true,
      metrics: {
        totalQuizzes,
        totalCorrect,
        totalWrong,
        averageAccuracy,
        averageScorePercent,
        readinessScore,
        streakDays: req.user.streak?.current || 1,
        xpPoints: req.user.xp || 100
      },
      performanceTrend,
      topicPerformance,
      recommendation: averageAccuracy < 50
        ? 'Focus on fundamental concepts and review questions in your Mistake Notebook before attempting full mock tests.'
        : 'Good consistency! Keep practicing time-bound sectional mock exams to maximize speed and eliminate negative marking.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
