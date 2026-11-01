/**
 * AspirantAI — OpenAI Question Provider Adapter
 * Connects to OpenAI API using OPENAI_API_KEY when available as alternate or fallback AI provider.
 */
const axios = require('axios');

class OpenAIProvider {
  constructor() {
    this.name = 'OpenAI Engine';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.models = [process.env.OPENAI_MODEL || 'gpt-4o-mini', 'gpt-4o'];
    this.quotaExhausted = false;
  }

  isConfigured() {
    return Boolean(!this.quotaExhausted && this.apiKey && this.apiKey.trim().startsWith('sk-'));
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
      throw new Error('OPENAI_API_KEY is not configured or credits are exhausted.');
    }

    const topicList = topics.length > 0 ? topics.join(', ') : 'Syllabus Core Fundamentals';

    const systemPrompt = `You are a chief examination paper setter for Indian competitive examinations at AspirantAI.
Generate exactly ${count} realistic, challenging multiple-choice practice questions matching the official syllabus.
You MUST output ONLY a JSON array of objects without markdown fences.
Every question must have:
- "questionText" (English)
- "questionHindi" (Hindi translation)
- "options": 4 items with keys 'A', 'B', 'C', 'D'
- "optionsHindi": 4 items with keys 'A', 'B', 'C', 'D'
- "correctAnswer": one of 'A', 'B', 'C', 'D'
- "explanation": step-by-step conceptual explanation in English
- "explanationHindi": explanation in Hindi`;

    const userPrompt = `Exam: ${examName} (${examCode}), Category: ${examCategory}, Subject: ${subject}, Topics: ${topicList}, Difficulty: ${difficulty}. Count: ${count}.`;

    let lastError = null;

    for (const model of this.models) {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 4096
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 20000
        });

        const rawText = response.data?.choices?.[0]?.message?.content;
        if (!rawText) continue;

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
        const errMsg = err.response?.data?.error?.message || err.message;
        lastError = errMsg;

        if (status === 429 && errMsg.includes('credits')) {
          this.quotaExhausted = true;
          console.warn('[OpenAIProvider] OpenAI quota exhausted. Switching off provider for current session.');
          break;
        }
      }
    }

    throw new Error(`OpenAI question generation failed: ${lastError}`);
  }
}

module.exports = OpenAIProvider;
