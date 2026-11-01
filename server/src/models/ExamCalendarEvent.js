const mongoose = require('mongoose');

const examCalendarEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  title: { type: String, required: true, trim: true },
  hindiTitle: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['UPSC', 'BPSC', 'SSC', 'GATE', 'Banking', 'Railway', 'Job', 'Internship', 'Interview', 'Personal Study'],
    required: true,
    index: true 
  },
  eventType: { 
    type: String, 
    enum: ['exam_date', 'application_deadline', 'admit_card', 'result', 'interview', 'study_reminder'],
    required: true,
    index: true 
  },
  eventDate: { type: Date, required: true, index: true },
  endDate: { type: Date },
  isOfficial: { type: Boolean, default: true },
  verificationStatus: { type: String, enum: ['confirmed', 'tentative'], default: 'confirmed' },
  officialNotificationUrl: { type: String, default: '' },
  source: { type: String, default: 'Official Gazette / Commission Notification' },
  lastCheckedDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExamCalendarEvent', examCalendarEventSchema);
