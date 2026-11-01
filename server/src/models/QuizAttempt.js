const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  timeLeftSeconds: {
    type: Number,
    default: 7200
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  savedAnswers: {
    type: Map,
    of: String,
    default: {}
  },
  markedForReviewList: [{
    type: Number
  }],
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: String, // 'A', 'B', 'C', 'D' or null
    isMarkedForReview: { type: Boolean, default: false },
    timeSpentSeconds: { type: Number, default: 0 },
    isCorrect: Boolean,
    marksAwarded: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  maxPossibleScore: {
    type: Number,
    default: 0
  },
  accuracyPercentage: {
    type: Number,
    default: 0
  },
  totalCorrect: {
    type: Number,
    default: 0
  },
  totalWrong: {
    type: Number,
    default: 0
  },
  totalUnanswered: {
    type: Number,
    default: 0
  },
  topicBreakdown: [{
    topic: String,
    total: Number,
    correct: Number,
    wrong: Number,
    accuracy: Number
  }]
}, {
  timestamps: true
});

// Compound index to ensure uniqueness if needed, or query past attempts
quizAttemptSchema.index({ userId: 1, quizId: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
