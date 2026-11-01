const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  targetExam: {
    type: String,
    required: true
  },
  targetExamDate: {
    type: Date,
    required: true
  },
  availableDailyHours: {
    type: Number,
    default: 4
  },
  dailyTasks: [{
    id: String,
    title: String,
    subject: String,
    durationMinutes: Number,
    isCompleted: { type: Boolean, default: false },
    scheduledDate: String // YYYY-MM-DD
  }],
  weeklyMilestones: [{
    weekNumber: Number,
    title: String,
    targetChapters: [String],
    isAchieved: { type: Boolean, default: false }
  }],
  syllabusCompletionPercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
