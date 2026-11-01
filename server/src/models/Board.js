const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: 'Central'
  },
  academicSessions: [{
    type: String,
    default: ['2024-2025', '2025-2026']
  }],
  classes: [{
    classLevel: {
      type: String, // '10', '12'
      required: true
    },
    streams: [{
      name: String, // 'General' (for 10th), 'Science PCM', 'Science PCB', 'Science PCMB', 'Commerce', 'Arts'
      subjects: [{
        code: String,
        name: String,
        hindiName: String,
        chapters: [{
          chapterNumber: Number,
          title: String,
          hindiTitle: String,
          description: String,
          formulaSheetUrl: String,
          revisionNotes: String,
          practiceQuestionCount: Number
        }]
      }]
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Board', boardSchema);
