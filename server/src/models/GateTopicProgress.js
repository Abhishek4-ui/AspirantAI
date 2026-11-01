const mongoose = require('mongoose');

const GateTopicProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  paperCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  completedTopics: [{
    type: String,
    trim: true
  }],
  bookmarkedQuestionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  completedQuestionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  notes: {
    type: Map,
    of: String,
    default: {}
  },
  readinessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastPracticedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

GateTopicProgressSchema.index({ userId: 1, paperCode: 1 }, { unique: true });

module.exports = mongoose.model('GateTopicProgress', GateTopicProgressSchema);
