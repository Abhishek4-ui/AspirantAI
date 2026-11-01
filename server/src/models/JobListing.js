const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: [
      'Software Engineer', 'Software Developer', 'Associate Software Engineer',
      'Graduate Engineer Trainee', 'Frontend Developer', 'Backend Developer',
      'Full-Stack Developer', 'JavaScript Developer', 'React Developer',
      'Node.js Developer', 'Python Developer', 'AI/ML Engineer',
      'Data Analyst', 'Data Scientist', 'QA Engineer', 'Software Tester',
      'IoT Engineer', 'Embedded Systems Engineer', 'Cloud Engineer',
      'DevOps Engineer', 'Cybersecurity Analyst', 'Technical Support Engineer',
      'Other Technical Roles'
    ],
    required: true,
    index: true
  },
  roleType: { 
    type: String, 
    enum: ['freshers', 'entry-level', 'graduate-trainee', 'internship-to-fulltime'], 
    default: 'freshers',
    index: true 
  },
  workArrangement: { type: String, enum: ['remote', 'hybrid', 'on-site'], default: 'hybrid' },
  location: { type: String, required: true },
  state: { type: String, default: 'All India' },
  city: { type: String, default: '' },
  fresherEligible: { type: Boolean, default: true, index: true },
  experienceRequired: { type: String, default: '0 - 1 Years' },
  salaryRange: { type: String, default: 'As per Industry Standards' },
  skillsRequired: [{ type: String }],
  eligibility: { type: String, default: 'B.Tech/BE/BCA/MCA/B.Sc IT fresh graduates' },
  officialApplyUrl: { type: String, required: true, trim: true },
  source: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date, required: true, index: true },
  verified: { type: Boolean, default: true, index: true },
  isExpired: { type: Boolean, default: false, index: true },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobListing', jobListingSchema);
