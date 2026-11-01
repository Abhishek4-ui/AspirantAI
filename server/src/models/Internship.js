const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  domain: { 
    type: String, 
    required: true,
    enum: [
      'Software Development', 'Frontend Development', 'Backend Development',
      'Full-Stack Development', 'React', 'Node.js', 'Python', 'C/C++',
      'AI/ML', 'Data Science', 'Data Analytics', 'Generative AI',
      'Cybersecurity', 'Cloud Computing', 'DevOps', 'IoT', 'Embedded Systems',
      'Computer Vision', 'NLP', 'Web Development', 'Mobile Development',
      'UI/UX', 'Software Testing', 'Research Internships'
    ],
    index: true 
  },
  workType: { type: String, enum: ['remote', 'hybrid', 'on-site'], default: 'remote' },
  compensationType: { type: String, enum: ['paid', 'unpaid'], default: 'paid' },
  stipend: { type: String, default: 'Disclosed upon selection' },
  duration: { type: String, default: '3 Months' },
  termType: { type: String, enum: ['part-time', 'full-time', 'summer', 'winter', 'research'], default: 'full-time' },
  location: { type: String, default: 'India' },
  applicationDeadline: { type: Date, required: true, index: true },
  officialUrl: { type: String, required: true, trim: true },
  requiredSkills: [{ type: String }],
  eligibility: { type: String, default: 'Open to freshers & undergraduate students' },
  source: { type: String, required: true },
  lastCheckedDate: { type: Date, default: Date.now },
  verified: { type: Boolean, default: true, index: true },
  isExpired: { type: Boolean, default: false, index: true },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
