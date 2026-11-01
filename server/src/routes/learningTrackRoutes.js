const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Structured curriculum and roadmap definitions
const ROADMAPS = {
  'gate-cse': {
    id: 'gate-cse',
    title: 'GATE Computer Science & Information Technology (CS/IT)',
    description: 'Comprehensive subject-wise roadmap mapped to the official GATE syllabus.',
    totalMilestones: 12,
    subjects: [
      {
        name: 'Engineering & Discrete Mathematics',
        weightage: '13-15 Marks',
        topics: ['Propositional & First-Order Logic', 'Sets, Relations, Functions, Partial Orders and Lattices', 'Monoids, Groups', 'Graphs: Connectivity, Matching, Coloring', 'Combinatorics & Counting', 'Linear Algebra: Matrices, Determinants, Eigenvalues', 'Calculus & Probability']
      },
      {
        name: 'Digital Logic & Computer Organization',
        weightage: '9-11 Marks',
        topics: ['Boolean Algebra & Minimization', 'Combinational & Sequential Circuits', 'Number Representations & Computer Arithmetic', 'Machine Instructions & Addressing Modes', 'ALU, Data Path & Control Unit', 'Instruction Pipelining & Hazards', 'Memory Hierarchy: Cache, Main Memory, Virtual Memory', 'I/O Interface']
      },
      {
        name: 'Programming & Data Structures',
        weightage: '8-10 Marks',
        topics: ['Programming in C: Recursion, Parameter Passing, Pointers', 'Arrays, Stacks, Queues', 'Linked Lists', 'Trees, Binary Search Trees, Binary Heaps', 'Graphs & Traversals']
      },
      {
        name: 'Algorithms',
        weightage: '8-10 Marks',
        topics: ['Asymptotic Analysis & Recurrences', 'Divide and Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'Graph Traversals: BFS, DFS, Shortest Paths, MST', 'NP-Completeness & Reductions']
      },
      {
        name: 'Theory of Computation & Compiler Design',
        weightage: '10-12 Marks',
        topics: ['Regular Expressions & Finite Automata', 'Context-Free Grammars & Pushdown Automata', 'Pumping Lemma', 'Turing Machines & Undecidability', 'Lexical Analysis & Parsing (LL, LR, LALR)', 'Syntax Directed Translation', 'Intermediate Code Generation', 'Code Optimization']
      },
      {
        name: 'Operating Systems',
        weightage: '8-10 Marks',
        topics: ['System Calls, Processes, Threads, CPU Scheduling', 'Inter-process Communication, Synchronization, Semaphores', 'Deadlock Detection, Prevention & Avoidance', 'Memory Management: Paging, Segmentation, Page Replacement', 'File Systems & Disk Scheduling']
      },
      {
        name: 'Databases & SQL',
        weightage: '7-9 Marks',
        topics: ['ER Model, Relational Model, Relational Algebra', 'Tuple Calculus & SQL Queries', 'Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)', 'Transactions & Concurrency Control (ACID, Serializability, 2PL)', 'Indexing & B/B+ Trees']
      },
      {
        name: 'Computer Networks',
        weightage: '8-10 Marks',
        topics: ['OSI & TCP/IP Model', 'Data Link Layer: Framing, Error Control, Flow Control, CSMA/CD', 'Network Layer: IPv4/IPv6, CIDR Subnetting, Routing (Distance Vector, Link State)', 'Transport Layer: TCP Congestion Control, UDP', 'Application Layer: DNS, SMTP, HTTP, FTP']
      }
    ]
  },
  'gate-da': {
    id: 'gate-da',
    title: 'GATE Data Science and Artificial Intelligence (DA)',
    description: 'Official curriculum for GATE Data Science & AI paper.',
    totalMilestones: 8,
    subjects: [
      {
        name: 'Probability and Statistics',
        weightage: '15-18 Marks',
        topics: ['Counting, Axioms of Probability, Conditional Probability, Bayes Theorem', 'Random Variables: Discrete and Continuous', 'Distributions: Bernoulli, Binomial, Poisson, Normal, Exponential', 'Expectation, Variance, Covariance, Correlation', 'Central Limit Theorem, Hypothesis Testing, Confidence Intervals']
      },
      {
        name: 'Linear Algebra & Calculus',
        weightage: '12-14 Marks',
        topics: ['Vector Spaces, Subspaces, Linear Dependence, Span', 'Matrices, Rank, Determinants, Linear Equations', 'Eigenvalues and Eigenvectors, Diagonalization', 'Singular Value Decomposition (SVD)', 'Multivariate Calculus: Maxima/Minima, Gradient Descent']
      },
      {
        name: 'Programming, Data Structures and Algorithms',
        weightage: '14-16 Marks',
        topics: ['Python Programming Basics', 'Stacks, Queues, Linked Lists, Trees, Hash Tables', 'Search Algorithms (Linear, Binary Search)', 'Sorting Algorithms', 'Graph Traversals (BFS, DFS, Dijkstra)']
      },
      {
        name: 'Database Management and Warehousing',
        weightage: '10-12 Marks',
        topics: ['ER-Model, Relational Model, Relational Algebra, SQL', 'Normalization & Query Optimization', 'Data Warehousing Concepts & OLAP']
      },
      {
        name: 'Machine Learning',
        weightage: '18-20 Marks',
        topics: ['Supervised Learning: Linear Regression, Logistic Regression, Ridge/Lasso', 'k-Nearest Neighbors, Decision Trees, Random Forests, SVM', 'Unsupervised Learning: k-Means, Hierarchical Clustering, PCA', 'Cross-Validation, Regularization, Bias-Variance Tradeoff, Evaluation Metrics']
      },
      {
        name: 'Artificial Intelligence',
        weightage: '14-16 Marks',
        topics: ['Informed & Uninformed Search: BFS, DFS, A* Search, Heuristic Search', 'Adversarial Search: Minimax, Alpha-Beta Pruning', 'Propositional and Predicate Logic', 'Reasoning under Uncertainty: Bayesian Networks, Markov Decision Processes']
      }
    ]
  },
  'dsa': {
    id: 'dsa',
    title: 'Data Structures & Algorithms Mastery Path',
    description: 'Comprehensive 20-topic learning journey from zero to competitive DSA mastery.',
    totalMilestones: 20,
    topics: [
      { id: 'arrays', name: 'Arrays & Two Pointers', difficulty: 'Beginner', lessonsCount: 8 },
      { id: 'strings', name: 'Strings & Pattern Matching', difficulty: 'Beginner', lessonsCount: 6 },
      { id: 'linked-lists', name: 'Linked Lists (Singly, Doubly, Circular)', difficulty: 'Intermediate', lessonsCount: 7 },
      { id: 'stacks-queues', name: 'Stacks, Queues & Monotonic Stacks', difficulty: 'Intermediate', lessonsCount: 9 },
      { id: 'hashing', name: 'Hashing, HashMaps & Frequency Counting', difficulty: 'Beginner', lessonsCount: 5 },
      { id: 'binary-search', name: 'Searching & Binary Search on Answer', difficulty: 'Intermediate', lessonsCount: 8 },
      { id: 'sorting', name: 'Sorting (Quick, Merge, Heap Sort)', difficulty: 'Beginner', lessonsCount: 6 },
      { id: 'recursion', name: 'Recursion & Backtracking', difficulty: 'Intermediate', lessonsCount: 8 },
      { id: 'trees', name: 'Binary Trees & Traversals', difficulty: 'Intermediate', lessonsCount: 10 },
      { id: 'bst', name: 'Binary Search Trees (BST)', difficulty: 'Intermediate', lessonsCount: 6 },
      { id: 'heaps', name: 'Heaps & Priority Queues', difficulty: 'Intermediate', lessonsCount: 7 },
      { id: 'graphs', name: 'Graphs: BFS, DFS & Topo Sort', difficulty: 'Advanced', lessonsCount: 12 },
      { id: 'shortest-paths', name: 'Dijkstra, Bellman-Ford & Floyd-Warshall', difficulty: 'Advanced', lessonsCount: 8 },
      { id: 'dynamic-programming-1d', name: '1D Dynamic Programming', difficulty: 'Intermediate', lessonsCount: 10 },
      { id: 'dynamic-programming-2d', name: '2D & Grid Dynamic Programming', difficulty: 'Advanced', lessonsCount: 12 },
      { id: 'dp-on-trees', name: 'DP on Trees & Bitmask DP', difficulty: 'Advanced', lessonsCount: 8 },
      { id: 'greedy', name: 'Greedy Algorithms & Interval Scheduling', difficulty: 'Intermediate', lessonsCount: 7 },
      { id: 'tries', name: 'Trie Prefix Trees & Applications', difficulty: 'Advanced', lessonsCount: 5 },
      { id: 'bit-manipulation', name: 'Bit Manipulation & Bitmasks', difficulty: 'Intermediate', lessonsCount: 6 },
      { id: 'time-space-complexity', name: 'Asymptotic Notation & Space Complexity', difficulty: 'Beginner', lessonsCount: 4 }
    ]
  },
  'web-dev': {
    id: 'web-dev',
    title: 'Full-Stack Modern Web Development',
    description: 'Roadmap from HTML/CSS foundations to production React, Node.js, Express, and MongoDB.',
    totalMilestones: 14,
    milestones: [
      { step: 1, title: 'HTML5 & Semantic Markup', description: 'SEO structure, accessibility (ARIA), modern form elements.' },
      { step: 2, title: 'CSS3, Flexbox & CSS Grid', description: 'Modern layout engines, responsive media queries, CSS variables.' },
      { step: 3, title: 'Tailwind CSS & Modern Utility Styling', description: 'Utility-first styling, glassmorphism, responsive utilities.' },
      { step: 4, title: 'JavaScript Fundamentals & ES6+', description: 'Closures, Event Loop, Promises, Async/Await, Destructuring, Modules.' },
      { step: 5, title: 'DOM & Browser APIs', description: 'Event delegation, Fetch API, LocalStorage, Web Workers, PWA basics.' },
      { step: 6, title: 'React 18 Architecture', description: 'Components, JSX, Hooks (useState, useEffect, useMemo, useCallback).' },
      { step: 7, title: 'Client Routing & State Management', description: 'React Router v6, Context API, TanStack Query.' },
      { step: 8, title: 'Node.js & Express.js Backend', description: 'Middleware architecture, REST API design, routing, request handling.' },
      { step: 9, title: 'MongoDB Atlas & Mongoose', description: 'Schemas, Models, Indexing, Validation, Aggregation pipelines.' },
      { step: 10, title: 'JWT Authentication & Security', description: 'Bcrypt hashing, JWT tokens, RBAC, Helmet, Rate limiting, CORS.' },
      { step: 11, title: 'Real-time WebSockets (Socket.IO)', description: 'Bi-directional events, rooms, live quizzes, notifications.' },
      { step: 12, title: 'Automated Testing (Jest / Supertest / Vitest)', description: 'Unit testing, API integration testing, test runners.' },
      { step: 13, title: 'Git, GitHub & Version Control', description: 'Branching, Pull Requests, Code Reviews, Git Hooks.' },
      { step: 14, title: 'Production Deployment & Observability', description: 'Vercel, Render, Environment Secrets, Health Checks, Logging.' }
    ]
  },
  'ai-ml': {
    id: 'ai-ml',
    title: 'AI, Machine Learning & Data Science Career Track',
    description: 'From Python data analysis to Deep Learning, Large Language Models, and MLOps.',
    totalMilestones: 12,
    milestones: [
      { step: 1, title: 'Python for Data Science', description: 'List comprehensions, generators, lambda functions, OOP.' },
      { step: 2, title: 'NumPy & Vectorized Math', description: 'N-dimensional arrays, broadcasting, vector dot products, indexing.' },
      { step: 3, title: 'Pandas & Data Wrangling', description: 'DataFrames, Series, missing value imputation, group-bys, joins.' },
      { step: 4, title: 'Data Visualization & EDA', description: 'Matplotlib, Seaborn, exploratory data analysis, distribution plots.' },
      { step: 5, title: 'Math Foundations (Linear Algebra, Calculus, Stats)', description: 'Eigenvalues, gradients, hypothesis testing, probability densities.' },
      { step: 6, title: 'Supervised Learning', description: 'Linear/Logistic regression, Decision Trees, Random Forests, XGBoost.' },
      { step: 7, title: 'Unsupervised Learning', description: 'k-Means clustering, Hierarchical clustering, PCA dimension reduction.' },
      { step: 8, title: 'Model Evaluation & Validation', description: 'Precision, Recall, F1-score, ROC-AUC, cross-validation.' },
      { step: 9, title: 'Deep Learning & Neural Networks', description: 'Backpropagation, PyTorch/TensorFlow, CNNs for computer vision.' },
      { step: 10, title: 'Natural Language Processing (NLP)', description: 'Tokenization, embeddings, Transformers, Attention mechanisms.' },
      { step: 11, title: 'Generative AI & LLMs', description: 'Prompt engineering, RAG (Retrieval Augmented Generation), LangChain.' },
      { step: 12, title: 'MLOps & Deployment', description: 'Model versioning, FastAPI inference endpoints, Docker containers, monitoring.' }
    ]
  }
};

/**
 * @route GET /api/v1/learning-tracks
 * List all structured roadmaps
 */
router.get('/', (req, res) => {
  const tracksSummary = Object.values(ROADMAPS).map(track => ({
    id: track.id,
    title: track.title,
    description: track.description,
    totalMilestones: track.totalMilestones
  }));

  res.json({
    success: true,
    tracks: tracksSummary
  });
});

/**
 * @route GET /api/v1/learning-tracks/:trackId
 * Get specific learning track curriculum
 */
router.get('/:trackId', (req, res) => {
  const track = ROADMAPS[req.params.trackId];
  if (!track) {
    return res.status(404).json({ success: false, message: 'Learning track not found.' });
  }

  res.json({
    success: true,
    track
  });
});

/**
 * @route POST /api/v1/learning-tracks/:trackId/progress
 * Record milestone completion
 */
router.post('/:trackId/progress', protect, async (req, res, next) => {
  try {
    const { milestoneId } = req.body;
    if (!milestoneId) {
      return res.status(400).json({ success: false, message: 'Milestone ID is required.' });
    }

    // Award XP and increment progress
    const user = await User.findByIdAndUpdate(req.user._id, {
      $inc: { xp: 20 },
      'streak.lastActiveDate': new Date()
    }, { new: true });

    res.json({
      success: true,
      message: 'Milestone recorded. 20 XP awarded.',
      xp: user.xp
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/learning-tracks/youtube-search
 * Live YouTube Data API search using configured key
 */
router.get('/youtube/search', async (req, res) => {
  const { q = 'GATE CSE Computer Science', maxResults = 8 } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      success: false,
      message: 'YouTube API key not configured on server.',
      items: []
    });
  }

  try {
    const axios = require('axios');
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q,
        maxResults: parseInt(maxResults) || 8,
        type: 'video',
        key: apiKey
      },
      timeout: 6000
    });

    const items = (response.data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.response?.data?.error?.message || 'YouTube search error',
      items: []
    });
  }
});

module.exports = router;
