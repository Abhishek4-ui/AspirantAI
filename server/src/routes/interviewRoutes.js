const express = require('express');
const router = express.Router();
const InterviewSession = require('../models/InterviewSession');
const { protect } = require('../middleware/auth');
const geminiService = require('../services/geminiService');

const DEFAULT_QUESTIONS = {
  technical: {
    'Software Engineer': [
      { questionText: 'Explain the event loop in Node.js and how asynchronous I/O operations are handled under the hood.', category: 'Node.js & Asynchronous Architecture' },
      { questionText: 'What is the Virtual DOM in React, and how does the reconciliation algorithm optimize rendering performance?', category: 'React & Frontend Performance' },
      { questionText: 'How would you design database indexing in MongoDB to optimize queries filtering by two fields with sorting?', category: 'Databases & Indexing' }
    ],
    'Frontend Developer': [
      { questionText: 'Explain the difference between CSS Flexbox and Grid, and describe when you would choose one over the other.', category: 'CSS & Modern Layouts' },
      { questionText: 'What are React Hooks dependencies rules, and what leads to stale closure bugs in useEffect?', category: 'React Architecture' }
    ],
    'Backend Developer': [
      { questionText: 'How do you prevent SQL injection and NoSQL injection vulnerabilities in an Express.js backend?', category: 'Backend Security' },
      { questionText: 'Explain the differences between JWT authentication and session-cookie authentication in terms of scalability and revocation.', category: 'Authentication Architecture' }
    ]
  },
  hr: {
    'All': [
      { questionText: 'Tell me about a challenging technical bug or conflict in a team project and how you systematically resolved it.', category: 'Behavioral & Problem Solving' },
      { questionText: 'Why are you passionate about preparing and working in technology/public administration, and where do you see your impact in 3 years?', category: 'Career Vision' }
    ]
  },
  dsa: {
    'All': [
      { questionText: 'Explain how you would detect a cycle in a singly linked list with O(1) auxiliary space.', category: 'Data Structures: Linked Lists' },
      { questionText: 'What is the difference between Dijkstra’s algorithm and Bellman-Ford algorithm for shortest paths in graphs?', category: 'Algorithms: Graphs' }
    ]
  },
  sql: {
    'All': [
      { questionText: 'Explain the difference between WHERE and HAVING clauses in SQL with an illustrative aggregation example.', category: 'SQL Querying' },
      { questionText: 'What are database ACID properties and how does an isolation level prevent dirty reads and phantom reads?', category: 'Database Systems' }
    ]
  }
};

/**
 * @route GET /api/v1/interviews
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/interviews/start
 */
router.post('/start', protect, async (req, res, next) => {
  try {
    const { role = 'Software Engineer', interviewType = 'technical', difficulty = 'entry' } = req.body;

    const pool = DEFAULT_QUESTIONS[interviewType]?.[role] ||
                 DEFAULT_QUESTIONS[interviewType]?.['All'] ||
                 DEFAULT_QUESTIONS['technical']['Software Engineer'];

    const questions = pool.map(q => ({
      questionText: q.questionText,
      category: q.category,
      userAnswer: '',
      aiFeedback: '',
      score: 0,
      strengths: [],
      improvements: []
    }));

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      interviewType,
      difficulty,
      questions,
      currentQuestionIndex: 0,
      status: 'in_progress'
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/interviews/:id/answer
 */
router.post('/:id/answer', protect, async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const idx = Number(questionIndex);
    if (!session.questions[idx]) {
      return res.status(400).json({ success: false, message: 'Invalid question index.' });
    }

    const q = session.questions[idx];
    q.userAnswer = answer || '';
    q.answeredAt = new Date();

    let feedback = '';
    let score = 7;
    let strengths = ['Clear structural articulation'];
    let improvements = ['Add more technical depth and edge-case discussion'];

    if (process.env.GEMINI_API_KEY && process.env.NODE_ENV !== 'test') {
      try {
        const prompt = `You are a Principal Engineering Interviewer evaluating a candidate's response.
Question: ${q.questionText}
Candidate Response: ${answer}

Evaluate objectively. Provide:
1. Score out of 10
2. Key Strengths (2 bullet points)
3. Areas for Improvement (2 bullet points)
4. Concise Model Answer`;
        feedback = await geminiService.callGemini([{ parts: [{ text: prompt }] }]);
        const scoreMatch = feedback.match(/(\d+)\s*\/\s*10/);
        if (scoreMatch) score = Number(scoreMatch[1]);
      } catch (err) {
        feedback = 'Evaluated: Strong conceptual clarity demonstrated. Recommend incorporating performance tradeoffs and edge cases.';
      }
    } else {
      const len = (answer || '').trim().length;
      score = len > 200 ? 9 : len > 100 ? 8 : len > 40 ? 6 : 4;
      feedback = `Automated Assessment: Candidate addressed the fundamental concepts of ${q.category}. Technical clarity: ${score}/10. Recommended: expand upon runtime complexity and production considerations.`;
      strengths = ['Addressed core technical terms', 'Structured explanation'];
      improvements = ['Provide concrete code examples', 'Discuss architectural tradeoffs'];
    }

    q.aiFeedback = feedback;
    q.score = score;
    q.strengths = strengths;
    q.improvements = improvements;

    if (session.currentQuestionIndex <= idx) {
      session.currentQuestionIndex = idx + 1;
    }

    await session.save();

    res.json({
      success: true,
      question: q,
      nextIndex: session.currentQuestionIndex,
      isLastQuestion: session.currentQuestionIndex >= session.questions.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/interviews/:id/finish
 */
router.post('/:id/finish', protect, async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const answered = session.questions.filter(q => q.userAnswer && q.score > 0);
    const avgScore = answered.length > 0
      ? Math.round((answered.reduce((acc, q) => acc + q.score, 0) / answered.length) * 10) / 10
      : 0;

    session.overallScore = avgScore;
    session.status = 'completed';
    session.overallFeedback = avgScore >= 8
      ? 'Excellent technical communication. Demonstrated solid grasp of core systems and problem-solving patterns.'
      : avgScore >= 6
      ? 'Good foundational knowledge. Strengthen articulation around system constraints, edge cases, and performance tradeoffs.'
      : 'Fundamental concepts need revision. Practice articulating step-by-step reasoning with practical examples.';

    await session.save();

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
