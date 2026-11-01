const mongoose = require('mongoose');

const mistakeNotebookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  questionText: String,
  questionHindi: String,
  studentAnswer: String,
  correctAnswer: String,
  explanation: String,
  explanationHindi: String,
  examCategory: {
    type: String,
    index: true
  },
  subject: String,
  topic: String,
  userNotes: {
    type: String,
    default: ''
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('MistakeNotebookEntry', mistakeNotebookSchema);
