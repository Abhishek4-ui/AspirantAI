const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true, index: true },
  language: { type: String, enum: ['javascript', 'python', 'java', 'cpp', 'c'], required: true },
  code: { type: String, required: true },
  status: { 
    type: String, 
    enum: [
      'Accepted', 
      'Wrong Answer', 
      'Time Limit Exceeded', 
      'Compilation Error', 
      'Runtime Error', 
      'Runner Unconfigured'
    ], 
    default: 'Accepted' 
  },
  executionTimeMs: { type: Number, default: 0 },
  memoryKb: { type: Number, default: 0 },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  compilerOutput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  errorMessage: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
