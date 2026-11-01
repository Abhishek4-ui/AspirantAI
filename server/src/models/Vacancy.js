const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  post: {
    type: String,
    required: true,
    trim: true
  },
  totalVacancies: {
    type: Number,
    required: true
  },
  notificationNumber: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Civil Services', 'SSC', 'Banking', 'Railway', 'Defence', 'Teaching', 'Police', 'Technical', 'State PSC', 'Other'],
    default: 'Other',
    index: true
  },
  stateOrCentral: {
    type: String,
    default: 'Central'
  },
  qualification: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  ageCriteria: {
    min: Number,
    max: Number,
    relaxation: String
  },
  applicationStartDate: {
    type: Date,
    required: true
  },
  applicationEndDate: {
    type: Date,
    required: true,
    index: true
  },
  examDate: {
    type: String,
    default: 'To be notified'
  },
  officialNotificationUrl: {
    type: String,
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'Employment News / Official Portal'
  },
  lastVerifiedTimestamp: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vacancy', vacancySchema);
