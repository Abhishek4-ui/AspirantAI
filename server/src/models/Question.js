const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionHindi: {
    type: String,
    default: ''
  },
  questionType: {
    type: String,
    enum: [
      'single_choice',
      'multiple_choice',
      'numerical',
      'true_false',
      'short_answer',
      'coding',
      'sql',
      'subjective',
      'image_based'
    ],
    default: 'single_choice',
    index: true
  },
  options: [{
    key: { type: String, required: true }, // 'A', 'B', 'C', 'D'
    text: { type: String, required: true }
  }],
  optionsHindi: [{
    key: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctAnswer: {
    type: String,
    required: true, // 'A', 'B', 'C', 'D' or numerical/text string
    trim: true
  },
  multipleCorrectAnswers: [{
    type: String
  }],
  numericalTolerance: {
    type: Number,
    default: 0.01
  },
  explanation: {
    type: String,
    default: ''
  },
  explanationHindi: {
    type: String,
    default: ''
  },
  relevantConcepts: [{
    type: String
  }],
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
  subject: {
    type: String,
    required: true,
    index: true
  },
  topic: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    index: true
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'bilingual'],
    default: 'bilingual'
  },
  marks: {
    type: Number,
    default: 2
  },
  negativeMarks: {
    type: Number,
    default: 0.66
  },
  source: {
    type: String,
    default: 'AspirantAI Verified Question Bank'
  },
  sourceType: {
    type: String,
    enum: ['official_pyq', 'human_curated', 'ai_generated', 'textbook'],
    default: 'ai_generated',
    index: true
  },
  officialSourceUrl: {
    type: String,
    default: ''
  },
  examinationYear: {
    type: Number,
    index: true
  },
  paperName: {
    type: String,
    default: ''
  },
  generationMethod: {
    type: String,
    enum: ['official_pyq', 'human_curated', 'ai_generated'],
    default: 'ai_generated'
  },
  isAiGenerated: {
    type: Boolean,
    default: true
  },
  duplicateHash: {
    type: String,
    index: true
  },
  validationStatus: {
    type: String,
    enum: ['approved', 'pending_review', 'flagged', 'rejected'],
    default: 'approved',
    index: true
  },
  flaggedReason: {
    type: String,
    default: ''
  },
  reviewTimestamp: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
