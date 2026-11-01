const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    default: 'Software Engineer'
  },
  interviewType: {
    type: String,
    enum: ['technical', 'hr', 'dsa', 'sql', 'system_design', 'administrative'],
    default: 'technical'
  },
  difficulty: {
    type: String,
    enum: ['entry', 'intermediate', 'advanced'],
    default: 'entry'
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  questions: [{
    questionText: { type: String, required: true },
    category: { type: String, default: 'General' },
    userAnswer: { type: String, default: '' },
    aiFeedback: { type: String, default: '' },
    score: { type: Number, min: 0, max: 10, default: 0 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    suggestedAnswer: { type: String, default: '' },
    answeredAt: { type: Date }
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: 0
  },
  overallFeedback: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
