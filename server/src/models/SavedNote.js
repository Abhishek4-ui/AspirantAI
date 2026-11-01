const mongoose = require('mongoose');

const savedNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  topic: { type: String, required: true, trim: true },
  examCategory: { type: String, default: 'General' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  content: { type: String, required: true },
  format: { 
    type: String, 
    enum: ['bullet_points', 'detailed_summary', 'formula_sheet', 'qa_format'], 
    default: 'detailed_summary' 
  },
  tags: [{ type: String }],
  folder: { type: String, default: 'Default' },
  isAiGenerated: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedNote', savedNoteSchema);
