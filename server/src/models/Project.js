const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  domain: { 
    type: String, 
    required: true,
    enum: [
      'Web Development', 'Full-Stack Development', 'AI/ML', 'Data Science',
      'IoT', 'Computer Vision', 'NLP', 'Generative AI', 'Cybersecurity', 'Automation'
    ],
    index: true 
  },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  description: { type: String, required: true },
  prerequisites: [{ type: String }],
  techStack: [{ type: String }],
  stepByStepGuidance: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    codeSnippet: { type: String, default: '' },
    testInstructions: { type: String, default: '' }
  }],
  testingGuidance: { type: String, default: '' },
  deploymentGuidance: { type: String, default: '' },
  gitGuidance: { type: String, default: '' },
  starterRepoUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  isOfficialTemplate: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
