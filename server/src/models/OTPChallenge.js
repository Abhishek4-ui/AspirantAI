const mongoose = require('mongoose');

const otpChallengeSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['email', 'mobile', 'password_reset'],
    required: true
  },
  hashedOtp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '10m' } // automatic cleanup TTL
  },
  attempts: {
    type: Number,
    default: 0
  },
  resendAvailableAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OTPChallenge', otpChallengeSchema);
