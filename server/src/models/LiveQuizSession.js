const mongoose = require('mongoose');

const liveQuizSessionSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting',
    index: true
  },
  currentQuestionIndex: {
    type: Number,
    default: -1
  },
  startedAt: Date,
  endedAt: Date,
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    socketId: String,
    score: { type: Number, default: 0 },
    answers: [{
      questionIndex: Number,
      selectedAnswer: String,
      timeTakenMs: Number,
      isCorrect: Boolean
    }],
    connected: { type: Boolean, default: true }
  }],
  leaderboard: [{
    rank: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    score: Number,
    correctCount: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveQuizSession', liveQuizSessionSchema);
