/**
 * AspirantAI — Gemini AI Question Provider Adapter
 * Connects to Google Gemini API using configured GEMINI_API_KEY to generate syllabus-accurate questions.
 */
const axios = require('axios');

class GeminiProvider {
  constructor() {
    this.name = 'Gemini AI Intelligence';
    this.apiKey = process.env.GEMINI_API_KEY;
    this.models = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite'
    ];
    if (process.env.GEMINI_MODEL && !this.models.includes(process.env.GEMINI_MODEL)) {
      this.models.push(process.env.GEMINI_MODEL);
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateQuestionsBatch({
    examCode,
    examName,
    examCategory,
    subject,
    topics = [],
    count = 10,
    language = 'en',
    difficulty = 'medium',
    positiveMarks = 2,
    negativeMarks = 0.66
  }) {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured.');
    }

    const topicList = topics.length > 0 ? topics.join(', ') : 'Syllabus Core Fundamentals';

    const prompt = `You are a chief examination paper setter for Indian competitive examinations at AspirantAI.
Generate exactly ${count} realistic, challenging multiple-choice practice questions matching the official syllabus.

Target Examination: ${examName} (${examCode})
Category: ${examCategory}
Subject: ${subject}
Relevant Topics: ${topicList}
Difficulty Level: ${difficulty}
Language Requirement: Both English and Hindi MUST be provided for every single question.

CRITICAL RULES:
1. Output MUST be a strictly valid JSON array of objects. Do NOT include markdown code blocks, backticks, or preamble text.
2. Every question must have 4 distinct options ('A', 'B', 'C', 'D'). No duplicate options.
3. "correctAnswer" must strictly match one of the option keys ('A', 'B', 'C', or 'D').
4. Provide a comprehensive conceptual explanation in English and Hindi.
5. Do NOT invent fake previous-year exam claims.

JSON Array Structure:
[
  {
    "questionText": "Clear, precise question in English",
    "questionHindi": "स्पष्ट एवं प्रामाणिक प्रश्न हिंदी में",
    "options": [
      { "key": "A", "text": "Option A text" },
      { "key": "B", "text": "Option B text" },
      { "key": "C", "text": "Option C text" },
      { "key": "D", "text": "Option D text" }
    ],
    "optionsHindi": [
      { "key": "A", "text": "विकल्प A हिंदी में" },
      { "key": "B", "text": "विकल्प B हिंदी में" },
      { "key": "C", "text": "विकल्प C हिंदी में" },
      { "key": "D", "text": "विकल्प D हिंदी में" }
    ],
    "correctAnswer": "A",
    "explanation": "Detailed step-by-step conceptual deduction explaining why this option is correct and why other options are incorrect.",
    "explanationHindi": "हिंदी में विस्तृत चरणबद्ध व्याख्या।",
    "subject": "${subject}",
    "topic": "${topics[0] || subject}",
    "difficulty": "${difficulty}",
    "marks": ${positiveMarks},
    "negativeMarks": ${negativeMarks}
  }
]`;

    let lastError = null;

    for (const model of this.models) {
      let attempts = 0;
      const maxRetries = 2;

      while (attempts <= maxRetries) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
          const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8192
            }
          }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
          });

          const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) {
            attempts++;
            continue;
          }

          const cleanedJson = rawText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```$/i, '')
            .trim();

          const parsed = JSON.parse(cleanedJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(q => ({
              ...q,
              examCode,
              examCategory,
              subject,
              topic: topics[0] || subject,
              difficulty,
              marks: positiveMarks,
              negativeMarks,
              language: 'bilingual',
              generationMethod: 'ai_generated',
              source: `AspirantAI Central Question Engine (${model})`,
              sourceType: 'ai_generated'
            }));
          }
        } catch (err) {
          const status = err.response?.status;
          lastError = err.response?.data?.error?.message || err.message;

          // Never sleep-retry on daily quota exhaustion — skip immediately to next model
          const isQuota = String(lastError).toLowerCase().includes('quota') || String(lastError).toLowerCase().includes('limit');
          if (!isQuota && (status === 503) && attempts < maxRetries) {
            attempts++;
            await this.sleep(300);
            continue;
          }

          // Permanent error or quota limit: try next model immediately
          break;
        }
      }
    }

    throw new Error(`Gemini question generation failed across all models: ${lastError}`);
  }
}

module.exports = GeminiProvider;
