const mongoose = require('mongoose');

const questionReportSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  examCode: {
    type: String,
    trim: true,
    index: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  userNote: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuestionReport', questionReportSchema);
