const mongoose = require('mongoose');

const youTubeProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  videoId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  subject: {
    type: String,
    default: ''
  },
  topic: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  isBookmarked: {
    type: Boolean,
    default: false,
    index: true
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound unique index per user per video
youTubeProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('YouTubeProgress', youTubeProgressSchema);
