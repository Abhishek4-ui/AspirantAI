/**
 * AspirantAI — Daily CBT Attempt Persistence Model
 * Real-time state persistence: saves selected answers, visited list, marked-for-review set,
 * and timer countdown so browser refresh never resets progress.
 */
const mongoose = require('mongoose');

const cbtAttemptSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CbtMockTest',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  examCode: {
    type: String,
    required: true
  },
  dateString: {
    type: String,
    required: true
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
  timeLeftSeconds: {
    type: Number,
    required: true,
    default: 3600 // 60 mins default
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  // In-progress selected answers: Map questionId/index -> optionKey ('A', 'B' or ['A', 'C'] for MSQ or numeric string)
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Array of question indexes marked for review
  markedForReview: [{
    type: Number
  }],
  // Array of visited question indexes
  visitedQuestions: [{
    type: Number
  }],
  // Final Score & Telemetry (calculated on backend)
  totalQuestions: { type: Number, default: 50 },
  totalAnswered: { type: Number, default: 0 },
  totalUnanswered: { type: Number, default: 50 },
  totalCorrect: { type: Number, default: 0 },
  totalWrong: { type: Number, default: 0 },
  totalMarksObtained: { type: Number, default: 0 },
  negativeMarksDeducted: { type: Number, default: 0 },
  maxPossibleScore: { type: Number, default: 100 },
  accuracyPercentage: { type: Number, default: 0 },
  timeTakenSeconds: { type: Number, default: 0 },
  topicBreakdown: [{
    topic: String,
    total: Number,
    correct: Number,
    wrong: Number,
    accuracy: Number
  }],
  questionReviews: [{
    index: Number,
    questionText: String,
    questionHindi: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String,
    explanationHindi: String,
    marksAwarded: Number,
    topic: String
  }]
}, {
  timestamps: true
});

cbtAttemptSchema.index({ userId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('CbtAttempt', cbtAttemptSchema);
