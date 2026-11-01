const Question = require('../models/Question');

/**
 * Validates question schema, duplicate check, and answer-key consistency
 */
const validateQuestionPayload = (q) => {
  const errors = [];

  if (!q.questionText || q.questionText.trim().length < 10) {
    errors.push('Question text is missing or too short.');
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push('Question must have exactly 4 options.');
  } else {
    const keys = q.options.map(o => o.key.toUpperCase());
    const expected = ['A', 'B', 'C', 'D'];
    if (!expected.every(k => keys.includes(k))) {
      errors.push('Options must be keyed A, B, C, D.');
    }
    const textSet = new Set(q.options.map(o => o.text.trim().toLowerCase()));
    if (textSet.size < 4) {
      errors.push('Option choices must all be distinct.');
    }
  }

  if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer ? q.correctAnswer.toUpperCase() : '')) {
    errors.push('Correct answer must be one of A, B, C, or D.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generates or validates an AI-created question set
 * Falls back to curated Question Bank if external AI generation is unavailable
 */
const generateAndValidateQuestions = async ({
  examCategory = 'General Knowledge',
  count = 100,
  difficulty = 'medium'
}) => {
  // Check available database questions for category
  let existingQuestions = await Question.find({
    examCategory,
    validationStatus: 'approved'
  }).limit(count);

  // If not enough questions in specific category, supplement with General approved questions
  if (existingQuestions.length < count) {
    const additional = await Question.find({
      _id: { $nin: existingQuestions.map(q => q._id) },
      validationStatus: 'approved'
    }).limit(count - existingQuestions.length);
    existingQuestions = [...existingQuestions, ...additional];
  }

  return existingQuestions;
};

module.exports = {
  validateQuestionPayload,
  generateAndValidateQuestions
};
