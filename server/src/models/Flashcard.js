const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    index: true
  },
  topic: {
    type: String,
    required: true
  },
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  hindiFront: String,
  hindiBack: String,
  formulaOrDiagramUrl: String,
  
  // Spaced Repetition (SM-2) Fields
  repetitions: {
    type: Number,
    default: 0
  },
  interval: {
    type: Number,
    default: 1 // days
  },
  easeFactor: {
    type: Number,
    default: 2.5
  },
  nextReviewDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastReviewedAt: Date,
  isBookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
