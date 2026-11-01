const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  hindiTitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  hindiDescription: {
    type: String,
    default: ''
  },
  examCategory: {
    type: String,
    required: true,
    index: true
  },
  examCode: {
    type: String,
    default: 'GENERAL',
    index: true
  },
  difficulty: {
    type: String,
    enum: ['all', 'easy', 'medium', 'hard'],
    default: 'medium'
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 100
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 120 // standard 2 hours for 100 questions
  },
  positiveMarks: {
    type: Number,
    default: 2
  },
  negativeMarks: {
    type: Number,
    default: 0.66
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  scheduledFor: {
    type: Date,
    default: Date.now,
    index: true
  },
  isDaily: {
    type: Boolean,
    default: false,
    index: true
  },
  isLive: {
    type: Boolean,
    default: false
  },
  isMock: {
    type: Boolean,
    default: false
  },
  isPYQ: {
    type: Boolean,
    default: false
  },
  pyqYear: Number,
  publishStatus: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
