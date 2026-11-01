const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  hindiTitle: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Civil Services', 'SSC', 'Banking', 'Railway', 'Defence', 'Teaching', 'Police', 'Engineering/Technical', 'State PSC', 'Board Exams', 'General'],
    index: true
  },
  conductingAuthority: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  ageLimits: {
    min: Number,
    max: Number,
    relaxationDetails: String
  },
  examPattern: {
    stages: [{
      stageName: String,
      mode: String, // Online / Offline
      totalMarks: Number,
      duration: String
    }],
    markingScheme: String,
    negativeMarking: {
      applicable: Boolean,
      fraction: String // e.g. "1/3rd (0.33)" or "1/4th (0.25)"
    }
  },
  syllabusOverview: [{
    subject: String,
    topics: [String]
  }],
  officialNotificationUrl: {
    type: String,
    default: ''
  },
  applicationUrl: {
    type: String,
    default: ''
  },
  importantDates: [{
    event: String,
    date: String,
    isTentative: Boolean
  }],
  verifiedPYQResources: [{
    year: Number,
    shift: String,
    title: String,
    fileUrl: String
  }],
  source: {
    type: String,
    default: 'Official Government Gazette / Conducting Agency'
  },
  lastVerificationTimestamp: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
