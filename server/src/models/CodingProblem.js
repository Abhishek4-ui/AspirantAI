const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  leetcodeNumber: { type: Number, index: true },
  leetcodeUrl: { type: String, default: '' },
  source: {
    type: String,
    enum: ['leetcode_verified', 'ai_generated', 'aspirantai_curated'],
    default: 'aspirantai_curated',
    index: true
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy', index: true },
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  topic: { type: String, default: 'Data Structures', index: true },
  companyTags: [{ type: String, index: true }],
  description: { type: String, required: true },
  hindiDescription: { type: String, default: '' },
  constraints: [{ type: String }],
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  expectedTimeComplexity: { type: String, default: 'O(N)' },
  expectedSpaceComplexity: { type: String, default: 'O(1)' },
  sampleTestCases: [testCaseSchema],
  hiddenTestCases: [testCaseSchema],
  starterCode: {
    javascript: { type: String, default: '// Write your solution here\nfunction solve(input) {\n  return input;\n}' },
    python: { type: String, default: '# Write your solution here\ndef solve(input_data):\n    return input_data' },
    java: { type: String, default: 'public class Solution {\n    public static void main(String[] args) {\n        // Read input and print output\n    }\n}' },
    cpp: { type: String, default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}' },
    c: { type: String, default: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}' }
  },
  timeLimitMs: { type: Number, default: 2000 },
  memoryLimitKb: { type: Number, default: 64000 },
  totalSubmissions: { type: Number, default: 0 },
  totalAccepted: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  isDailyChallenge: { type: Boolean, default: false },
  dailyChallengeDate: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
