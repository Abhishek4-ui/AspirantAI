const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  mobile: {
    type: String,
    trim: true,
    sparse: true,
    index: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
    required: function() {
      return !this.googleId && !this.githubId;
    }
  },
  role: {
    type: String,
    enum: ['student', 'contentReviewer', 'contentManager', 'admin'],
    default: 'student',
    index: true
  },
  isEmailVerified: {
    type: Boolean,
    default: true // Direct email verified upon signup per Rule 8 (removal of OTP requirement)
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  githubId: {
    type: String,
    sparse: true,
    index: true
  },
  
  // Onboarding & Exam Selection
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  primaryExamId: {
    type: String,
    default: ''
  },
  preparationGoals: [{
    type: String
  }],
  preferredSubjects: [{
    type: String
  }],
  educationProfile: {
    board: { type: String, default: '' },
    session: { type: String, default: '2025-2026' },
    classLevel: { type: String, default: '' }, // 'class_10', 'class_12', 'graduate'
    degree: { type: String, default: '' },
    stream: { type: String, default: '' }, // 'PCM', 'PCB', 'PCMB', 'Commerce', 'Arts', 'CSE', 'ECE', 'Mechanical'
    subjects: [{ type: String }]
  },
  studyPreferences: {
    targetHoursPerDay: { type: Number, default: 4 },
    dailyQuizNotification: { type: Boolean, default: true },
    targetExamDate: { type: Date }
  },
  studySchedule: {
    preferredStudyTime: { type: String, default: 'morning' }, // 'morning', 'afternoon', 'evening', 'night'
    timeZone: { type: String, default: 'Asia/Kolkata' },
    daysActive: [{ type: String }]
  },
  savedResources: [{
    title: { type: String, required: true },
    url: { type: String, default: '' },
    resourceType: { type: String, default: 'link' },
    savedAt: { type: Date, default: Date.now }
  }],

  // Gamification & Progress
  streak: {
    current: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
  },
  xp: {
    type: Number,
    default: 100
  },
  stats: {
    quizzesAttempted: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 }
  },

  // Developer Profile & Portfolio Integrations
  developerProfile: {
    bio: { type: String, default: '' },
    githubUsername: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    skills: [{ type: String }],
    isPublic: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
