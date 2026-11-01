/**
 * AspirantAI — Daily CBT Mock Test Model
 * Independent 50-Question Computer Based Test paper generated per examination and date (Asia/Kolkata).
 */
const mongoose = require('mongoose');

const cbtQuestionSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  questionText: { type: String, required: true },
  questionHindi: { type: String, default: '' },
  questionType: {
    type: String,
    enum: ['single_choice', 'multiple_choice', 'numerical', 'true_false', 'short_answer'],
    default: 'single_choice'
  },
  options: [{
    key: { type: String, required: true },
    text: { type: String, required: true }
  }],
  optionsHindi: [{
    key: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctAnswer: { type: String, required: true },
  multipleCorrectAnswers: [{ type: String }],
  numericalTolerance: { type: Number, default: 0.01 },
  explanation: { type: String, default: '' },
  explanationHindi: { type: String, default: '' },
  subject: { type: String, default: 'General Studies' },
  topic: { type: String, default: 'Core Fundamentals' },
  difficulty: { type: String, default: 'medium' },
  marks: { type: Number, default: 2 },
  negativeMarks: { type: Number, default: 0.66 },
  source: { type: String, default: 'AspirantAI CBT Question Engine' }
}, { _id: true });

const cbtMockTestSchema = new mongoose.Schema({
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
  examCode: {
    type: String,
    required: true,
    index: true
  },
  examCategory: {
    type: String,
    required: true,
    index: true
  },
  dateString: {
    type: String,
    required: true,
    index: true // e.g. "2026-10-31" in Asia/Kolkata
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'bilingual'],
    default: 'en'
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 50
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 60
  },
  positiveMarks: {
    type: Number,
    default: 2
  },
  negativeMarks: {
    type: Number,
    default: 0.66
  },
  questions: [cbtQuestionSchema],
  publishStatus: {
    type: String,
    enum: ['published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Compound index to guarantee uniqueness of a daily CBT test per exam and date
cbtMockTestSchema.index({ examCode: 1, dateString: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('CbtMockTest', cbtMockTestSchema);
