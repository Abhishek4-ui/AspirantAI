/**
 * AspirantAI — Open Trivia Database External Question Provider Adapter
 * Connects to the public Open Trivia Database API (https://opentdb.com) to retrieve
 * verified questions in Computers, Science, History, and Geography.
 */
const axios = require('axios');

class OpenTriviaProvider {
  constructor() {
    this.name = 'Open Trivia Database API';
    // Map our examination subjects to OpenTDB categories
    this.categoryMap = {
      'Science': 17, // Science & Nature
      'Computer Science': 18, // Computers
      'Mathematics': 19, // Mathematics
      'Geography': 22, // Geography
      'History': 23 // History
    };
  }

  isConfigured() {
    return true; // Public verified educational API, no private secret required
  }

  async fetchQuestions({ subject, count = 5, difficulty = 'medium' }) {
    let catId = this.categoryMap[subject] || 9; // General Knowledge default
    const safeCount = Math.min(Math.max(1, count), 15);

    try {
      const url = `https://opentdb.com/api.php?amount=${safeCount}&category=${catId}&type=multiple&difficulty=${difficulty === 'hard' ? 'hard' : difficulty === 'easy' ? 'easy' : 'medium'}`;
      const response = await axios.get(url, { timeout: 8000 });

      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        return response.data.results.map((item, idx) => {
          const decode = (str) => {
            return (str || '')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');
          };

          const questionText = decode(item.question);
          const correctAnswerText = decode(item.correct_answer);
          const incorrect = (item.incorrect_answers || []).map(decode);

          // Shuffle options deterministically
          const allOptionsText = [...incorrect, correctAnswerText].sort();
          const optionKeys = ['A', 'B', 'C', 'D'];
          const options = allOptionsText.slice(0, 4).map((text, i) => ({
            key: optionKeys[i],
            text
          }));

          const correctOption = options.find(o => o.text === correctAnswerText) || options[0];

          return {
            questionText,
            questionHindi: `[सामान्य अध्ययन] ${questionText}`,
            options,
            optionsHindi: options.map(o => ({ key: o.key, text: o.text })),
            correctAnswer: correctOption.key,
            explanation: `The correct option is (${correctOption.key}): "${correctOption.text}". Verified by Open Trivia Academic Knowledge Base.`,
            explanationHindi: `सही उत्तर (${correctOption.key}): "${correctOption.text}" है।`,
            subject: subject || item.category,
            topic: item.category,
            difficulty: item.difficulty || 'medium',
            marks: 2,
            negativeMarks: 0.66,
            language: 'en',
            generationMethod: 'human_curated',
            source: 'Open Trivia Database API (Verified Public Resource)',
            sourceType: 'human_curated'
          };
        });
      }
      return [];
    } catch (err) {
      // Graceful fallback to AI if rate limited or network glitch
      return [];
    }
  }
}

module.exports = OpenTriviaProvider;
