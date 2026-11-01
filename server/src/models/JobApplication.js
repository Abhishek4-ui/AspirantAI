const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  listingType: { 
    type: String, 
    enum: ['internship', 'job', 'vacancy', 'custom'], 
    default: 'job' 
  },
  listingId: { type: String, default: '' },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: [
      'Interested', 
      'Preparing to Apply', 
      'Applied', 
      'Assessment', 
      'Interview', 
      'Offer Received', 
      'Rejected', 
      'Withdrawn'
    ], 
    default: 'Applied',
    index: true 
  },
  appliedDate: { type: Date, default: Date.now },
  interviewDate: { type: Date },
  followUpDate: { type: Date },
  deadline: { type: Date },
  notes: { type: String, default: '' },
  officialUrl: { type: String, default: '' },
  reminderSet: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
