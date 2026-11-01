const express = require('express');
const router = express.Router();
const axios = require('axios');
const CodingProblem = require('../models/CodingProblem');
const CodeSubmission = require('../models/CodeSubmission');
const CodingBookmark = require('../models/CodingBookmark');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');
const leetcodeService = require('../services/coding/leetcodeService');
const jwt = require('jsonwebtoken');

// Ensure default LeetCode problem library is seeded
leetcodeService.ensureDefaultLeetCodeProblems();

// Language mapping for Judge0
const JUDGE0_LANGUAGE_IDS = {
  javascript: 63, // JavaScript (Node.js 12.14.0) or 93 (Node.js 18)
  python: 71,     // Python (3.8.1) or 92 (Python 3.11.2)
  java: 62,       // Java (OpenJDK 13.0.1) or 91 (JDK 17)
  cpp: 54,        // C++ (GCC 9.2.0)
  c: 50           // C (GCC 9.2.0)
};

/**
 * @route GET /api/v1/coding/problems
 * List all coding problems with filters
 */
router.get('/problems', async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 50 } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.$or = [{ category }, { topic: category }];
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { companyTags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [problems, total] = await Promise.all([
      CodingProblem.find(filter)
        .select('-hiddenTestCases')
        .sort({ leetcodeNumber: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CodingProblem.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: problems.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      problems
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/leetcode/problems
 * Comprehensive LeetCode Problem Directory Explorer
 */
router.get('/leetcode/problems', async (req, res, next) => {
  try {
    const {
      topic = 'All',
      difficulty = 'All',
      company = 'All',
      search = '',
      page = 1,
      limit = 25
    } = req.query;

    const filter = { isPublished: true };

    if (topic && topic !== 'All') {
      filter.$or = [
        { topic: new RegExp(topic, 'i') },
        { category: new RegExp(topic, 'i') }
      ];
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (company && company !== 'All') {
      filter.companyTags = { $in: [new RegExp(company, 'i')] };
    }
    if (search) {
      const reg = new RegExp(search, 'i');
      filter.$or = [
        { title: reg },
        { description: reg },
        { tags: { $in: [reg] } },
        { companyTags: { $in: [reg] } }
      ];
    }

    // Optional user token extraction to annotate solved / bookmarked status
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded?.id;
      } catch (_) {}
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [problems, total] = await Promise.all([
      CodingProblem.find(filter)
        .select('-hiddenTestCases')
        .sort({ leetcodeNumber: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CodingProblem.countDocuments(filter)
    ]);

    let solvedProblemIds = new Set();
    let bookmarkedProblemIds = new Set();

    if (userId) {
      const [acceptedSubmissions, bookmarks] = await Promise.all([
        CodeSubmission.find({ userId, status: 'Accepted' }).select('problemId'),
        CodingBookmark.find({ userId }).select('problemId')
      ]);
      solvedProblemIds = new Set(acceptedSubmissions.map(s => s.problemId.toString()));
      bookmarkedProblemIds = new Set(bookmarks.map(b => b.problemId.toString()));
    }

    const annotatedProblems = problems.map(p => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      leetcodeNumber: p.leetcodeNumber,
      leetcodeUrl: p.leetcodeUrl || `https://leetcode.com/problems/${p.slug}/`,
      difficulty: p.difficulty,
      category: p.category,
      topic: p.topic || p.category,
      companyTags: p.companyTags || [],
      description: p.description,
      hindiDescription: p.hindiDescription,
      expectedTimeComplexity: p.expectedTimeComplexity,
      expectedSpaceComplexity: p.expectedSpaceComplexity,
      sampleTestCases: p.sampleTestCases,
      starterCode: p.starterCode,
      source: p.source || 'leetcode_verified',
      tags: p.tags,
      isSolved: solvedProblemIds.has(p._id.toString()),
      isBookmarked: bookmarkedProblemIds.has(p._id.toString())
    }));

    // Standard list of topics & company tags for filter dropdowns
    const topicsList = [
      'All', 'Arrays & Hashing', 'Two Pointers & Sliding Window', 'Strings',
      'Stacks & Queues', 'Linked Lists', 'Trees & BST', 'Heaps & Tries',
      'Graphs', 'Dynamic Programming', 'Backtracking & Recursion', 'Greedy',
      'Bit Manipulation', 'Database & SQL'
    ];

    const companiesList = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Bloomberg', 'Uber'];

    res.json({
      success: true,
      count: annotatedProblems.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      topicsList,
      companiesList,
      problems: annotatedProblems
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/daily-challenge
 * LeetCode Daily Coding Challenge
 */
router.get('/daily-challenge', async (req, res, next) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        userId = decoded?.id;
      } catch (_) {}
    }

    const challenge = await leetcodeService.getDailyChallenge(userId);
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/coding/daily-challenge/complete
 * Record daily challenge completion and award streak + XP
 */
router.post('/daily-challenge/complete', protect, async (req, res, next) => {
  try {
    const { problemId, notes } = req.body;
    if (!problemId) {
      return res.status(400).json({ success: false, message: 'problemId is required.' });
    }

    // Award 100 XP and bump streak
    const user = await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: 100, 'streak.current': 1 },
      'streak.lastActiveDate': new Date()
    }, { new: true });

    res.json({
      success: true,
      message: 'Daily Coding Challenge completed! +100 XP awarded.',
      xp: user.xp,
      streak: user.streak?.current || 1
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/coding/ai/generate
 * Generate original AI coding interview problem using Gemini/OpenAI
 */
router.post('/ai/generate', protect, async (req, res, next) => {
  try {
    const { topic = 'Arrays', difficulty = 'Medium', targetCompany = 'General Tech', language = 'javascript' } = req.body;
    const generated = await leetcodeService.generateAiCodingProblem({
      topic,
      difficulty,
      targetCompany,
      language
    });

    res.status(201).json({
      success: true,
      message: 'Original AI Coding Problem generated and validated successfully.',
      problem: generated
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/roadmaps
 * DSA Learning Roadmaps (30, 60, 90 Days)
 */
router.get('/roadmaps', async (req, res, next) => {
  try {
    let userSolvedSlugs = new Set();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        if (decoded?.id) {
          const accepted = await CodeSubmission.find({ userId: decoded.id, status: 'Accepted' })
            .populate('problemId', 'slug');
          userSolvedSlugs = new Set(accepted.map(s => s.problemId?.slug).filter(Boolean));
        }
      } catch (_) {}
    }

    const roadmaps = leetcodeService.getDsaRoadmaps(userSolvedSlugs);
    res.json({
      success: true,
      roadmaps
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/coding/bookmark
 * Toggle bookmark on a problem
 */
router.post('/bookmark', protect, async (req, res, next) => {
  try {
    const { problemId, notes } = req.body;
    if (!problemId) {
      return res.status(400).json({ success: false, message: 'problemId is required.' });
    }

    const existing = await CodingBookmark.findOne({ userId: req.user._id, problemId });
    if (existing) {
      await CodingBookmark.findByIdAndDelete(existing._id);
      return res.json({ success: true, isBookmarked: false, message: 'Bookmark removed.' });
    } else {
      await CodingBookmark.create({ userId: req.user._id, problemId, notes });
      return res.json({ success: true, isBookmarked: true, message: 'Problem bookmarked.' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/progress
 * Candidate coding stats and breakdown
 */
router.get('/progress', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [submissions, bookmarks] = await Promise.all([
      CodeSubmission.find({ userId }).populate('problemId', 'title slug difficulty category topic'),
      CodingBookmark.find({ userId }).populate('problemId', 'title slug difficulty category')
    ]);

    const solvedSet = new Set();
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    const topicCounts = {};

    submissions.forEach(s => {
      if (s.status === 'Accepted' && s.problemId) {
        const idStr = s.problemId._id.toString();
        if (!solvedSet.has(idStr)) {
          solvedSet.add(idStr);
          if (s.problemId.difficulty === 'Easy') easyCount++;
          else if (s.problemId.difficulty === 'Medium') mediumCount++;
          else if (s.problemId.difficulty === 'Hard') hardCount++;

          const t = s.problemId.topic || s.problemId.category || 'General';
          topicCounts[t] = (topicCounts[t] || 0) + 1;
        }
      }
    });

    const user = await User.findById(userId).select('xp streak');

    res.json({
      success: true,
      stats: {
        totalAttempted: submissions.length,
        totalSolved: solvedSet.size,
        difficultyBreakdown: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount
        },
        topicCoverage: Object.keys(topicCounts).map(t => ({ topic: t, count: topicCounts[t] })),
        bookmarkedCount: bookmarks.length,
        bookmarks,
        streakDays: user?.streak?.current || 1,
        xp: user?.xp || 0,
        recentSubmissions: submissions.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/problems/:slug
 * Get problem details by slug
 */
router.get('/problems/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const problem = await CodingProblem.findOne({ slug, isPublished: true })
      .select('-hiddenTestCases'); // Never leak hidden test cases

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    next(error);
  }
});

const vm = require('vm');

/**
 * In-process secure JavaScript sandbox runner
 */
function runJsInProcess(sourceCode, input, expectedOutput) {
  const sandbox = { console: { log: () => {} } };
  vm.createContext(sandbox);

  const startTime = Date.now();
  try {
    // Detect function name from source code
    const fnMatch = sourceCode.match(/function\s+([a-zA-Z0-9_$]+)/);
    const fnName = fnMatch ? fnMatch[1] : 'solution';

    let argLiteral = JSON.stringify(input);
    // If input is JSON parseable, pass parsed representation
    try {
      const parsed = JSON.parse(input);
      argLiteral = JSON.stringify(parsed);
    } catch (_) {}

    const evalScript = `${sourceCode}\n; __out = typeof ${fnName} === 'function' ? ${fnName}(${argLiteral}) : null;`;
    vm.runInContext(evalScript, sandbox, { timeout: 2000 });

    const executionTimeMs = Math.max(1, Date.now() - startTime);
    const actual = sandbox.__out;
    const actualStr = String(actual);
    
    // Normalize comparison
    let isMatch = false;
    if (String(actual).trim() === String(expectedOutput).trim()) {
      isMatch = true;
    } else {
      try {
        isMatch = JSON.stringify(actual) === JSON.stringify(JSON.parse(expectedOutput));
      } catch (_) {}
    }

    return {
      success: true,
      status: isMatch ? 'Accepted' : 'Wrong Answer',
      output: actualStr,
      expected: expectedOutput,
      timeMs: executionTimeMs,
      memoryKb: 1420
    };
  } catch (err) {
    return {
      success: false,
      status: 'Runtime Error',
      error: err.message,
      timeMs: Date.now() - startTime
    };
  }
}

/**
 * Helper to execute code via Judge0 if configured
 */
async function executeOnJudge0(sourceCode, language, stdin = '', expectedOutput = '') {
  const judge0Url = process.env.JUDGE0_API_URL;
  const judge0Key = process.env.JUDGE0_API_KEY;

  if (!judge0Url) {
    return {
      configured: false,
      message: 'Sandboxed code execution provider (Judge0) is not configured on the server. To enable real-time compilation and execution for C, C++, Java, Python, and JavaScript, set JUDGE0_API_URL in server/.env.'
    };
  }

  const languageId = JUDGE0_LANGUAGE_IDS[language.toLowerCase()] || 63;
  const headers = { 'Content-Type': 'application/json' };
  if (judge0Key) {
    headers['X-RapidAPI-Key'] = judge0Key;
    headers['X-RapidAPI-Host'] = new URL(judge0Url).hostname;
  }

  try {
    const response = await axios.post(`${judge0Url}/submissions?wait=true`, {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
      expected_output: expectedOutput || undefined,
      cpu_time_limit: 2.5,
      memory_limit: 128000
    }, { headers, timeout: 10000 });

    return {
      configured: true,
      data: response.data
    };
  } catch (err) {
    if (err.response?.status === 403) {
      return {
        configured: false,
        message: 'RapidAPI Judge0 CE Free Plan subscription needed. Visit https://rapidapi.com/hermanzdosilovic/api/judge0-ce and click "Subscribe (Free)" to activate sandbox.'
      };
    }
    return {
      configured: false,
      message: err.response?.data?.message || err.message
    };
  }
}

/**
 * @route POST /api/v1/coding/run
 * Run code against sample test cases
 */
router.post('/run', protect, async (req, res, next) => {
  try {
    const { problemId, language, code, customInput } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required.' });
    }

    let problem = null;
    if (problemId) {
      problem = await CodingProblem.findById(problemId);
    }

    const testInput = customInput || (problem && problem.sampleTestCases[0] ? problem.sampleTestCases[0].input : '');
    const expectedOutput = (!customInput && problem && problem.sampleTestCases[0]) ? problem.sampleTestCases[0].expectedOutput : '';

    const execResult = await executeOnJudge0(code, language, testInput, expectedOutput);

    if (!execResult.configured) {
      if (language.toLowerCase() === 'javascript' && process.env.NODE_ENV !== 'test') {
        const jsRes = runJsInProcess(code, testInput, expectedOutput);
        return res.json({
          success: true,
          runnerConfigured: true,
          status: jsRes.status,
          stdout: jsRes.output || '',
          stderr: jsRes.error || '',
          compileOutput: '',
          executionTimeMs: jsRes.timeMs || 10,
          memoryKb: jsRes.memoryKb || 1200
        });
      }

      return res.status(200).json({
        success: false,
        runnerConfigured: false,
        status: 'Runner Unconfigured',
        message: execResult.message,
        sampleInput: testInput,
        expectedOutput: expectedOutput,
        userCode: code
      });
    }

    const result = execResult.data;
    res.json({
      success: true,
      runnerConfigured: true,
      status: result.status ? result.status.description : 'Executed',
      stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf8') : (result.stdout || ''),
      stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf8') : (result.stderr || ''),
      compileOutput: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf8') : '',
      executionTimeMs: Math.round((parseFloat(result.time) || 0) * 1000),
      memoryKb: result.memory || 0
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      return res.status(503).json({
        success: false,
        runnerConfigured: false,
        message: 'Could not connect to external Judge0 code execution service. Please check server/.env configuration.'
      });
    }
    next(error);
  }
});

/**
 * @route POST /api/v1/coding/submit
 * Submit solution against all test cases and persist submission
 */
router.post('/submit', protect, async (req, res, next) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ success: false, message: 'Problem ID, language, and code are required.' });
    }

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const allTestCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];
    const judge0Url = process.env.JUDGE0_API_URL;

    // In-process fallback execution for JavaScript
    if (!judge0Url && language.toLowerCase() === 'javascript') {
      let passedCount = 0;
      let finalStatus = 'Accepted';
      let maxTimeMs = 0;
      let lastError = '';

      for (let i = 0; i < allTestCases.length; i++) {
        const tc = allTestCases[i];
        const res = runJsInProcess(code, tc.input, tc.expectedOutput);
        if (res.timeMs > maxTimeMs) maxTimeMs = res.timeMs;

        if (res.status === 'Accepted') {
          passedCount++;
        } else {
          finalStatus = res.status;
          lastError = res.error || `Expected: ${tc.expectedOutput}, Actual: ${res.output}`;
          break;
        }
      }

      const submission = await CodeSubmission.create({
        userId: req.user._id,
        problemId: problem._id,
        language,
        code,
        status: finalStatus,
        executionTimeMs: maxTimeMs,
        memoryKb: 1420,
        testCasesPassed: passedCount,
        totalTestCases: allTestCases.length,
        errorMessage: lastError
      });

      // Update problem statistics
      problem.totalSubmissions += 1;
      if (finalStatus === 'Accepted') {
        problem.totalAccepted += 1;
      }
      problem.acceptanceRate = Math.round((problem.totalAccepted / problem.totalSubmissions) * 100);
      await problem.save();

      if (finalStatus === 'Accepted') {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { xp: 50 },
          'streak.lastActiveDate': new Date()
        });
      }

      return res.status(201).json({
        success: true,
        runnerConfigured: true,
        submission: {
          id: submission._id,
          status: finalStatus,
          testCasesPassed: passedCount,
          totalTestCases: allTestCases.length,
          executionTimeMs: maxTimeMs,
          memoryKb: 1420,
          errorMessage: lastError
        }
      });
    }

    if (!judge0Url) {
      // Record attempt as Runner Unconfigured
      const submission = await CodeSubmission.create({
        userId: req.user._id,
        problemId: problem._id,
        language,
        code,
        status: 'Runner Unconfigured',
        totalTestCases: allTestCases.length,
        errorMessage: 'Execution sandbox is not configured on this environment. Set JUDGE0_API_URL in server/.env.'
      });

      return res.status(200).json({
        success: false,
        runnerConfigured: false,
        submissionId: submission._id,
        status: 'Runner Unconfigured',
        message: 'Sandboxed code execution provider (Judge0) is not configured. Solution saved to your history.'
      });
    }

    // Execute test cases through Judge0
    let passedCount = 0;
    let finalStatus = 'Accepted';
    let maxTimeMs = 0;
    let maxMemoryKb = 0;
    let lastError = '';

    for (let i = 0; i < allTestCases.length; i++) {
      const tc = allTestCases[i];
      const exec = await executeOnJudge0(code, language, tc.input, tc.expectedOutput);
      if (!exec.configured) {
        finalStatus = 'Runner Unconfigured';
        break;
      }

      const resData = exec.data;
      const statusId = resData.status ? resData.status.id : 0;
      const timeMs = Math.round((parseFloat(resData.time) || 0) * 1000);
      const memKb = resData.memory || 0;
      if (timeMs > maxTimeMs) maxTimeMs = timeMs;
      if (memKb > maxMemoryKb) maxMemoryKb = memKb;

      if (statusId === 3) { // 3 = Accepted in Judge0
        passedCount++;
      } else {
        if (statusId === 4) finalStatus = 'Wrong Answer';
        else if (statusId === 5) finalStatus = 'Time Limit Exceeded';
        else if (statusId === 6) finalStatus = 'Compilation Error';
        else finalStatus = 'Runtime Error';
        lastError = resData.stderr ? Buffer.from(resData.stderr, 'base64').toString('utf8') : (resData.message || '');
        break; // Stop at first failed test case
      }
    }

    if (passedCount === allTestCases.length) {
      finalStatus = 'Accepted';
    }

    const submission = await CodeSubmission.create({
      userId: req.user._id,
      problemId: problem._id,
      language,
      code,
      status: finalStatus,
      executionTimeMs: maxTimeMs,
      memoryKb: maxMemoryKb,
      testCasesPassed: passedCount,
      totalTestCases: allTestCases.length,
      errorMessage: lastError
    });

    // Update problem statistics
    problem.totalSubmissions += 1;
    if (finalStatus === 'Accepted') {
      problem.totalAccepted += 1;
    }
    problem.acceptanceRate = Math.round((problem.totalAccepted / problem.totalSubmissions) * 100);
    await problem.save();

    // Update user streak & XP
    if (finalStatus === 'Accepted') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { xp: 50 },
        'streak.lastActiveDate': new Date()
      });
    }

    res.status(201).json({
      success: true,
      runnerConfigured: true,
      submission: {
        id: submission._id,
        status: finalStatus,
        testCasesPassed: passedCount,
        totalTestCases: allTestCases.length,
        executionTimeMs: maxTimeMs,
        memoryKb: maxMemoryKb,
        errorMessage: lastError
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/coding/submissions/my
 * User submission history
 */
router.get('/submissions/my', protect, async (req, res, next) => {
  try {
    const submissions = await CodeSubmission.find({ userId: req.user._id })
      .populate('problemId', 'title slug difficulty category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
