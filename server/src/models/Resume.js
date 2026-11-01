const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'My Technical Resume' },
  template: { type: String, enum: ['modern', 'classic', 'minimal', 'tech'], default: 'modern' },
  targetRole: { type: String, default: 'Software Engineer' },
  personalInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [{
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    grade: { type: String, default: '' }
  }],
  experience: [{
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    highlights: [{ type: String }]
  }],
  projects: [{
    title: { type: String, default: '' },
    techStack: [{ type: String }],
    liveUrl: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    bulletPoints: [{ type: String }]
  }],
  skills: [{
    category: { type: String, default: 'Technical' }, // e.g. Languages, Frameworks, Developer Tools
    items: [{ type: String }]
  }],
  certifications: [{
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    credentialUrl: { type: String, default: '' }
  }],
  achievements: [{ type: String }],
  isPrimary: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
