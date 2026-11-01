/**
 * AspirantAI — LeetCode & Coding Intelligence Engine
 * Handles LeetCode Problem Directory, Daily Challenge, AI Problem Generator, and DSA Roadmaps.
 */
const CodingProblem = require('../../models/CodingProblem');
const CodeSubmission = require('../../models/CodeSubmission');
const CodingBookmark = require('../../models/CodingBookmark');
const User = require('../../models/User');
const LEETCODE_PROBLEMS = require('./leetcodeSeedData');
const axios = require('axios');

/**
 * Ensure default verified LeetCode problem library exists in database
 */
async function ensureDefaultLeetCodeProblems() {
  try {
    for (const p of LEETCODE_PROBLEMS) {
      const exists = await CodingProblem.findOne({ slug: p.slug });
      if (!exists) {
        await CodingProblem.create(p);
      } else if (!exists.leetcodeUrl || !exists.companyTags || exists.companyTags.length === 0) {
        exists.leetcodeNumber = p.leetcodeNumber;
        exists.leetcodeUrl = p.leetcodeUrl;
        exists.companyTags = p.companyTags;
        exists.source = 'leetcode_verified';
        exists.topic = p.topic || p.category;
        await exists.save();
      }
    }
  } catch (err) {
    console.warn('[LeetCode Service] Problem sync notice:', err.message);
  }
}

/**
 * Daily Coding Challenge
 * Date-keyed daily problem matching Asia/Kolkata date
 */
async function getDailyChallenge(userId = null) {
  const now = new Date();
  const kolkataTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const yyyy = kolkataTime.getFullYear();
  const mm = String(kolkataTime.getMonth() + 1).padStart(2, '0');
  const dd = String(kolkataTime.getDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}`;

  // Find or select today's problem deterministically
  const total = await CodingProblem.countDocuments({ source: 'leetcode_verified' });
  const dayOfYear = Math.floor((kolkataTime - new Date(kolkataTime.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const problemIndex = total > 0 ? (dayOfYear % total) : 0;

  const problem = await CodingProblem.findOne({ source: 'leetcode_verified' }).skip(problemIndex) 
    || await CodingProblem.findOne();

  let userStatus = 'unattempted';
  let userSubmission = null;

  if (userId && problem) {
    userSubmission = await CodeSubmission.findOne({
      userId,
      problemId: problem._id
    }).sort({ createdAt: -1 });

    if (userSubmission) {
      userStatus = userSubmission.status === 'Accepted' ? 'solved' : 'attempted';
    }
  }

  return {
    dateString,
    problem,
    userStatus,
    userSubmission
  };
}

/**
 * Generate original AI coding problem using Gemini or OpenAI
 */
async function generateAiCodingProblem({ topic = 'Arrays', difficulty = 'Medium', targetCompany = 'General Tech', language = 'javascript' }) {
  const prompt = `You are a Principal Software Engineer and Technical Interviewer at a Tier-1 tech company.
Generate an ORIGINAL, high-quality coding interview problem for practice.
DO NOT copy any copyrighted LeetCode or HackerRank problem verbatim.

Requirements:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Target Interview Standard: ${targetCompany}
- Language: ${language}

Return a STRICT JSON object with these EXACT keys:
{
  "title": "Problem Title",
  "slug": "url-friendly-slug",
  "difficulty": "${difficulty}",
  "category": "${topic}",
  "topic": "${topic}",
  "companyTags": ["${targetCompany}"],
  "description": "Clear problem statement explaining inputs, outputs, edge cases.",
  "hindiDescription": "Problem statement in clear Hindi.",
  "constraints": ["1 <= n <= 10^5", "All values are integers."],
  "expectedTimeComplexity": "O(N)",
  "expectedSpaceComplexity": "O(1)",
  "inputFormat": "Description of input structure",
  "outputFormat": "Description of output",
  "sampleTestCases": [
    {
      "input": "Sample input string or JSON",
      "expectedOutput": "Sample output string or JSON",
      "explanation": "Why this output is produced"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "Edge case input",
      "expectedOutput": "Expected edge case output",
      "explanation": "Edge case validation"
    }
  ],
  "starterCode": {
    "javascript": "function solve(input) {\\n  // Write solution\\n}",
    "python": "def solve(input_data):\\n    pass",
    "java": "class Solution {\\n    public int solve(int[] input) { return 0; }\\n}",
    "cpp": "class Solution {\\npublic:\\n    int solve(vector<int>& input) { return 0; }\\n};",
    "c": "int solve(int* input, int n) { return 0; }"
  }
}
Return only valid JSON. No markdown backticks.`;

  let parsed = null;

  // Try Gemini First
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const models = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      process.env.GEMINI_MODEL || 'gemini-3.8-flash'
    ];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const response = await axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2500,
            responseMimeType: 'application/json'
          }
        }, { timeout: 12000 });

        const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleaned);
          break;
        }
      } catch (err) {
        console.warn(`[AI Problem Generator] ${model} attempt notice:`, err.message);
      }
    }
  }

  // Fallback to OpenAI
  if (!parsed && process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        timeout: 12000
      });

      const raw = response.data?.choices?.[0]?.message?.content;
      if (raw) parsed = JSON.parse(raw);
    } catch (openAiErr) {
      console.warn('[AI Problem Generator] OpenAI fallback notice:', openAiErr.message);
    }
  }

  if (!parsed || !parsed.title) {
    throw new Error('AI Problem Generation is temporarily unavailable. Please retry shortly.');
  }

  // Guarantee slug uniqueness
  parsed.slug = `${parsed.slug || 'ai-problem'}-${Date.now()}`;
  parsed.source = 'ai_generated';
  parsed.isPublished = true;

  const saved = await CodingProblem.create(parsed);
  return saved;
}

/**
 * DSA Roadmaps (30-day, 60-day, 90-day plans)
 */
function getDsaRoadmaps(userSolvedSlugs = new Set()) {
  const roadmaps = [
    {
      id: 'dsa-30-day',
      title: '30-Day SDE Fast-Track Plan',
      description: 'Crucial foundational algorithms and data structures for fast technical interview turnaround.',
      durationDays: 30,
      totalProblems: 30,
      phases: [
        {
          week: 1,
          theme: 'Arrays, Two Pointers & Sliding Window',
          slugs: ['two-sum', 'best-time-to-buy-and-sell-stock', 'contains-duplicate', '3sum', 'container-with-most-water']
        },
        {
          week: 2,
          theme: 'Strings, Stacks & Queues',
          slugs: ['valid-anagram', 'valid-parentheses', 'valid-palindrome', 'longest-substring-without-repeating-characters']
        },
        {
          week: 3,
          theme: 'Linked Lists & Binary Trees',
          slugs: ['reverse-linked-list', 'linked-list-cycle', 'merge-two-sorted-lists', 'invert-binary-tree', 'maximum-depth-of-binary-tree']
        },
        {
          week: 4,
          theme: 'Dynamic Programming & Graphs',
          slugs: ['climbing-stairs', 'coin-change', 'number-of-islands', 'house-robber']
        }
      ]
    },
    {
      id: 'dsa-60-day',
      title: '60-Day Placement Comprehensive Preparation',
      description: 'Systematic coverage of core data structures, graph traversals, and recursion paradigms.',
      durationDays: 60,
      totalProblems: 60,
      phases: [
        {
          week: '1-2',
          theme: 'Mastering Linear Structures & Hash Tables',
          slugs: ['two-sum', 'contains-duplicate', 'product-of-array-except-self', 'valid-anagram', 'group-anagrams', 'valid-parentheses']
        },
        {
          week: '3-4',
          theme: 'Two Pointers & Linked Lists Cycles',
          slugs: ['3sum', 'container-with-most-water', 'reverse-linked-list', 'linked-list-cycle', 'lru-cache']
        },
        {
          week: '5-6',
          theme: 'Trees, BST, & Heaps',
          slugs: ['invert-binary-tree', 'maximum-depth-of-binary-tree', 'same-tree', 'lowest-common-ancestor-of-a-bst', 'kth-largest-element-in-an-array']
        },
        {
          week: '7-8',
          theme: 'Graphs, Dynamic Programming & Backtracking',
          slugs: ['number-of-islands', 'course-schedule', 'climbing-stairs', 'coin-change', 'subsets', 'word-search']
        }
      ]
    },
    {
      id: 'dsa-90-day',
      title: '90-Day FAANG & Tier-1 MNC Mastery',
      description: 'Advanced graph algorithms, state-space dynamic programming, monotonic stacks, and system-level coding.',
      durationDays: 90,
      totalProblems: 90,
      phases: [
        {
          week: '1-4',
          theme: 'Foundations & Linear Structures',
          slugs: ['two-sum', 'contains-duplicate', 'valid-anagram', 'best-time-to-buy-and-sell-stock', 'valid-parentheses', 'reverse-linked-list']
        },
        {
          week: '5-8',
          theme: 'Non-Linear Trees, Tries & Heaps',
          slugs: ['invert-binary-tree', 'validate-binary-search-tree', 'binary-tree-level-order-traversal', 'implement-trie-prefix-tree', 'top-k-frequent-elements']
        },
        {
          week: '9-12',
          theme: 'Advanced Graphs, 2D DP & Optimization',
          slugs: ['number-of-islands', 'course-schedule', 'coin-change', 'longest-increasing-subsequence', 'edit-distance', 'trapping-rain-water']
        }
      ]
    }
  ];

  // Calculate user progress per roadmap
  return roadmaps.map(roadmap => {
    let totalSlugs = 0;
    let solvedSlugs = 0;

    roadmap.phases.forEach(phase => {
      phase.slugs.forEach(slug => {
        totalSlugs++;
        if (userSolvedSlugs.has(slug)) solvedSlugs++;
      });
    });

    const completionPercentage = totalSlugs > 0 ? Math.round((solvedSlugs / totalSlugs) * 100) : 0;

    return {
      ...roadmap,
      totalTrackedProblems: totalSlugs,
      solvedCount: solvedSlugs,
      completionPercentage
    };
  });
}

module.exports = {
  ensureDefaultLeetCodeProblems,
  getDailyChallenge,
  generateAiCodingProblem,
  getDsaRoadmaps
};
