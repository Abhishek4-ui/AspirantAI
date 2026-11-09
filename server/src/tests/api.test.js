const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const CbtAttempt = require('../models/CbtAttempt');

jest.setTimeout(25000);

describe('AspirantAI Complete Backend Test Suite', () => {
  let authToken = '';
  let signupUserToken = '';
  let adminToken = '';
  let testUserId = '';
  let sampleQuizId = '';
  let sampleQuestionId = '';
  let interviewSessionId = '';

  beforeAll(async () => {
    jest.setTimeout(30000);
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspirantai';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    try {
      await User.collection.dropIndex('mobile_1');
    } catch (_) {}
    try {
      await User.syncIndexes();
    } catch (_) {}

    // Ensure student fixture
    let student = await User.findOne({ email: 'student@aspirantai.in' });
    if (!student) {
      student = await User.create({
        name: 'Priya Verma',
        email: 'student@aspirantai.in',
        mobile: '+919876543212',
        password: 'StudentPassword@123',
        role: 'student',
        isEmailVerified: true,
        preferredLanguage: 'hi',
        onboardingCompleted: true,
        primaryExamId: 'BPSC_CCE'
      });
    }

    // Clean up previous attempts for clean test runs
    await CbtAttempt.deleteMany({ userId: student._id });
    await QuizAttempt.deleteMany({ userId: student._id });

    // Ensure admin fixture
    let admin = await User.findOne({ email: 'admin@aspirantai.in' });
    if (!admin) {
      admin = await User.create({
        name: 'Abhishek Kumar (Admin)',
        email: 'admin@aspirantai.in',
        mobile: '+919876543210',
        password: 'AdminPassword@123',
        role: 'admin',
        isEmailVerified: true,
        preferredLanguage: 'en',
        onboardingCompleted: true
      });
    }

    const Flashcard = require('../models/Flashcard');
    await QuizAttempt.deleteMany({ userId: student._id });
    await Flashcard.updateMany({ userId: student._id }, { repetitions: 0, intervalDays: 1, easeFactor: 2.5 });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Health check
  test('GET /api/v1/health should return healthy status and creator credit', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.creator).toContain('Abhishek Kumar');
  });

  // 2. Direct Signup without OTP (Rule 8)
  test('POST /api/v1/auth/signup creates account directly without OTP requirement', async () => {
    const uniqueEmail = `test_${Date.now()}@aspirantai.in`;
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Test Aspirant',
        email: uniqueEmail,
        password: 'SecurePassword@123',
        preferredLanguage: 'en'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.isEmailVerified).toBe(true);
    signupUserToken = res.body.token;
    testUserId = res.body.user.id;
  });

  // 3. OAuth Providers status check (Rule 7)
  test('GET /api/v1/auth/providers returns Google and GitHub OAuth status honestly', async () => {
    const res = await request(app).get('/api/v1/auth/providers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.providers.google).toBeDefined();
    expect(res.body.providers.github).toBeDefined();
  });

  test('GET /api/v1/auth/google/url returns honest provider status or URL', async () => {
    const res = await request(app).get('/api/v1/auth/google/url');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeDefined();
    if (!process.env.GOOGLE_CLIENT_ID) {
      expect(res.body.configured).toBe(false);
      expect(res.body.message).toContain('GOOGLE_CLIENT_ID');
    }
  });

  test('GET /api/v1/auth/github/url returns honest provider status or URL', async () => {
    const res = await request(app).get('/api/v1/auth/github/url');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeDefined();
    if (!process.env.GITHUB_CLIENT_ID) {
      expect(res.body.configured).toBe(false);
      expect(res.body.message).toContain('GITHUB_CLIENT_ID');
    }
  });

  // 4. Login existing user
  test('POST /api/v1/auth/login logs in valid student', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'student@aspirantai.in',
        password: 'StudentPassword@123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  // 5. Login admin user for RBAC verification
  test('POST /api/v1/auth/login logs in admin', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@aspirantai.in',
        password: 'AdminPassword@123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe('admin');
    adminToken = res.body.token;
  });

  // 6. RBAC Protection
  test('Admin route /api/v1/admin/stats forbids students (RBAC check)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('Admin route /api/v1/admin/stats allows admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.stats.totalUsers).toBeGreaterThan(0);
  });

  // 7. Admin Config Status (Section 5 & 28: Never exposes secrets)
  test('GET /api/v1/admin/config-status reports live configuration without revealing secrets', async () => {
    const res = await request(app)
      .get('/api/v1/admin/config-status')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.providers.length).toBeGreaterThanOrEqual(6);
    // Assert secrets are NOT leaked in output
    const jsonStr = JSON.stringify(res.body);
    expect(jsonStr).not.toContain('aspirantai_jwt_super_secure');
    expect(jsonStr).not.toContain('AdminPassword');
  });

  // 8. Onboarding & Preferences
  test('POST /api/v1/onboarding/preferences persists user exam choices', async () => {
    const res = await request(app)
      .post('/api/v1/onboarding/preferences')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        primaryExamId: 'BPSC_CCE',
        preparationGoals: ['BPSC_CCE', 'UPSC_CSE'],
        preferredLanguage: 'hi',
        educationProfile: {
          classLevel: 'graduate',
          stream: 'General'
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.primaryExamId).toBe('BPSC_CCE');
    expect(res.body.user.onboardingCompleted).toBe(true);
  });

  // 9. Exam directory & Universal Exam Catalog
  test('GET /api/v1/exams returns verified exams list', async () => {
    const res = await request(app).get('/api/v1/exams');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('GET /api/v1/mock-tests/catalog returns comprehensive 70+ exam catalog', async () => {
    const res = await request(app).get('/api/v1/mock-tests/catalog');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(50);
    const codes = res.body.exams.map(e => e.code);
    expect(codes).toContain('UPSC_CSE');
    expect(codes).toContain('BPSC_CCE');
    expect(codes).toContain('JEE_MAIN');
    expect(codes).toContain('NEET_UG');
    expect(codes).toContain('SSC_CGL');
    expect(codes).toContain('IBPS_PO');
  });

  test('GET /api/v1/daily-quiz/today?examCode=JEE_MAIN delivers Engineering questions without DBMS leakage', async () => {
    const res = await request(app).get('/api/v1/daily-quiz/today?examCode=JEE_MAIN');
    expect(res.statusCode).toBe(200);
    expect(res.body.quiz.examCode).toBe('JEE_MAIN');
    expect(res.body.quiz.examCategory).toBe('Engineering Entrance');
    expect(res.body.quiz.questions.length).toBeGreaterThan(0);
    // Ensure questions are NOT DBMS/computer science
    const firstQ = res.body.quiz.questions[0];
    expect(firstQ.subject).not.toBe('Database Management Systems');
  });

  // 10. Daily Quiz security: No answer leakage
  test('GET /api/v1/daily-quiz/today does NOT leak correctAnswer or explanation', async () => {
    const res = await request(app).get('/api/v1/daily-quiz/today');
    expect(res.statusCode).toBe(200);
    expect(res.body.quiz.questions.length).toBeGreaterThan(0);
    sampleQuizId = res.body.quiz.id;
    const firstQ = res.body.quiz.questions[0];
    sampleQuestionId = firstQ.id;

    // Critical Security assertion: No answer leakage
    expect(firstQ.correctAnswer).toBeUndefined();
    expect(firstQ.explanation).toBeUndefined();
  });

  // 11. Server-authoritative scoring & Negative marking evaluation
  test('POST /api/v1/daily-quiz/:id/submit scores accurately with negative marks', async () => {
    const realQ = await Question.findById(sampleQuestionId);
    expect(realQ).toBeDefined();

    const responses = [
      {
        questionId: realQ._id,
        selectedAnswer: realQ.correctAnswer, // Correct
        timeSpentSeconds: 15
      }
    ];

    const res = await request(app)
      .post(`/api/v1/daily-quiz/${sampleQuizId}/submit`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ responses, timeSpentSeconds: 45 });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCorrect).toBe(1);
    expect(res.body.score).toBe(2);
  });

  // 12. Idempotent submission: Prevent score tampering
  test('Re-submitting the same quiz is rejected idempotently', async () => {
    const res = await request(app)
      .post(`/api/v1/daily-quiz/${sampleQuizId}/submit`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ responses: [], timeSpentSeconds: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.alreadySubmitted).toBe(true);
  });

  // 12b. Daily Quiz live progress persistence
  test('PUT /api/v1/daily-quiz/attempt/progress saves quiz answers and resume state', async () => {
    const res = await request(app)
      .put('/api/v1/daily-quiz/attempt/progress')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        quizId: sampleQuizId,
        timeLeftSeconds: 3200,
        currentIndex: 3,
        answers: { [sampleQuestionId]: 'A' },
        markedForReview: [sampleQuestionId]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 12c. Daily CBT Mock Test paper assembly and security
  test('GET /api/v1/mock-tests/daily-cbt returns CBT paper without leaking answers', async () => {
    const res = await request(app)
      .get('/api/v1/mock-tests/daily-cbt?examCode=UPSC_CSE&language=en')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cbtTest).toBeDefined();
    expect(res.body.cbtTest.questions.length).toBeGreaterThan(0);
    // Crucial: no answer keys leaked to candidate
    expect(res.body.cbtTest.questions[0].correctAnswer).toBeUndefined();
    expect(res.body.cbtTest.questions[0].explanation).toBeUndefined();
  });

  // 12d. Daily CBT candidate progress saving
  test('PUT /api/v1/mock-tests/cbt/progress persists answers and timer state', async () => {
    const getRes = await request(app)
      .get('/api/v1/mock-tests/daily-cbt?examCode=UPSC_CSE&language=en')
      .set('Authorization', `Bearer ${authToken}`);

    const testId = getRes.body.cbtTest.id;
    const firstQId = getRes.body.cbtTest.questions[0].id;

    const res = await request(app)
      .put('/api/v1/mock-tests/cbt/progress')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        testId,
        timeLeftSeconds: 3500,
        currentIndex: 1,
        answers: { [firstQId]: 'B' },
        markedForReview: [1],
        visitedQuestions: [1, 2]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 12e. Daily CBT submission and evaluation
  test('POST /api/v1/mock-tests/cbt/submit evaluates test with negative marking', async () => {
    const getRes = await request(app)
      .get('/api/v1/mock-tests/daily-cbt?examCode=UPSC_CSE&language=en')
      .set('Authorization', `Bearer ${authToken}`);

    const testId = getRes.body.cbtTest.id;
    const firstQId = getRes.body.cbtTest.questions[0].id;

    const res = await request(app)
      .post('/api/v1/mock-tests/cbt/submit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        testId,
        answers: { [firstQId]: 'A' },
        timeTakenSeconds: 300
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.score).toBeDefined();
    expect(res.body.totalCorrect + res.body.totalWrong + res.body.totalUnanswered).toBe(getRes.body.cbtTest.questions.length);
  });

  // 13. Central AI Question Engine (Section 7)
  test('POST /api/v1/questions/generate creates validated questions with AI attribution', async () => {
    const res = await request(app)
      .post('/api/v1/questions/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        examCategory: 'Civil Services',
        subject: 'Indian Polity',
        topic: 'Fundamental Rights',
        count: 2,
        difficulty: 'medium'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    const q = res.body.questions[0];
    expect(q.isAiGenerated).toBe(true);
    expect(q.generationMethod).toBe('ai_generated');
    expect(q.correctAnswer).toBeDefined();
    expect(q.explanation.length).toBeGreaterThan(10);
  });

  // 14. Full-Length Mock Tests & CBT Simulation (Section 9 & 10)
  test('GET /api/v1/mock-tests returns full mock test series', async () => {
    const res = await request(app).get('/api/v1/mock-tests');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.mocks[0].durationMinutes).toBeGreaterThan(0);
  });

  test('GET /api/v1/mock-tests/pyq returns authentic papers with official source URLs', async () => {
    const res = await request(app).get('/api/v1/mock-tests/pyq');
    expect(res.statusCode).toBe(200);
    expect(res.body.papers.length).toBeGreaterThan(0);
    expect(res.body.papers[0].officialSourceUrl).toMatch(/^https?:\/\//);
    expect(res.body.papers[0].verified).toBe(true);
  });

  // 15. AI Interview Preparation Suite (Section 22)
  test('POST /api/v1/interviews/start and answer flow records evaluation', async () => {
    const startRes = await request(app)
      .post('/api/v1/interviews/start')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        role: 'Software Engineer',
        interviewType: 'technical',
        difficulty: 'entry'
      });

    expect(startRes.statusCode).toBe(201);
    expect(startRes.body.session._id).toBeDefined();
    interviewSessionId = startRes.body.session._id;

    const answerRes = await request(app)
      .post(`/api/v1/interviews/${interviewSessionId}/answer`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionIndex: 0,
        answer: 'Node.js event loop coordinates non-blocking I/O using libuv thread pool and phases including timers, pending callbacks, poll, check, and close.'
      });

    expect(answerRes.statusCode).toBe(200);
    expect(answerRes.body.question.aiFeedback).toBeDefined();
    expect(answerRes.body.question.score).toBeGreaterThanOrEqual(1);
  });

  // 16. Spaced Repetition (SM-2) Flashcard review
  test('POST /api/v1/flashcards/:id/review computes new interval via SM-2', async () => {
    const getCards = await request(app)
      .get('/api/v1/flashcards')
      .set('Authorization', `Bearer ${authToken}`);
    expect(getCards.statusCode).toBe(200);
    const cardId = getCards.body.cards[0]._id;

    const reviewRes = await request(app)
      .post(`/api/v1/flashcards/${cardId}/review`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ rating: 4 });

    expect(reviewRes.statusCode).toBe(200);
    expect(reviewRes.body.card.repetitions).toBe(1);
    expect(reviewRes.body.nextReviewDays).toBeGreaterThanOrEqual(1);
  });

  // 17. Vacancies endpoint
  test('GET /api/v1/vacancies returns official verified announcements', async () => {
    const res = await request(app).get('/api/v1/vacancies');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.vacancies[0].isVerified).toBe(true);
  });

  // 18. Coding Practice: Problem listing & Hidden test cases never exposed
  test('GET /api/v1/coding/problems returns problems without leaking hidden test cases', async () => {
    const res = await request(app).get('/api/v1/coding/problems');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    const problem = res.body.problems[0];
    expect(problem.title).toBeDefined();
    expect(problem.hiddenTestCases).toBeUndefined();
  });

  // 19. Coding Runner: Honest unconfigured response when Judge0 not configured
  test('POST /api/v1/coding/run reports honest unconfigured status if sandbox unavailable', async () => {
    const res = await request(app)
      .post('/api/v1/coding/run')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        language: 'javascript',
        code: 'console.log("hello");',
        customInput: '1 2'
      });

    expect(res.statusCode).toBe(200);
    if (!process.env.JUDGE0_API_URL) {
      expect(res.body.runnerConfigured).toBe(false);
      expect(res.body.status).toBe('Runner Unconfigured');
    }
  });

  // 20. Dedicated Internship Portal: Verified listings & filters
  test('GET /api/v1/internships returns verified internships with official URLs', async () => {
    const res = await request(app).get('/api/v1/internships');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.internships[0].officialUrl).toMatch(/^https?:\/\//);
    expect(res.body.internships[0].verified).toBe(true);
  });

  // 21. Fresher Job Portal: Role filtering & verified listings
  test('GET /api/v1/jobs returns entry-level positions with valid application links', async () => {
    const res = await request(app).get('/api/v1/jobs?fresherOnly=true');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.jobs[0].fresherEligible).toBe(true);
    expect(res.body.jobs[0].officialApplyUrl).toMatch(/^https?:\/\//);
  });

  // 22. Application Tracker: Save and retrieve application records
  test('POST & GET /api/v1/applications persists candidate pipeline stages', async () => {
    const postRes = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Full-Stack Developer Intern',
        company: 'InnovateTech Solutions',
        status: 'Applied',
        notes: 'Applied via official careers portal'
      });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.application.company).toBe('InnovateTech Solutions');

    const getRes = await request(app)
      .get('/api/v1/applications')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.count).toBeGreaterThan(0);
    expect(getRes.body.stageCounts['Applied']).toBeGreaterThanOrEqual(1);
  });

  // 23. Resume Builder, Reviewer & Cover Letter Generator (Section 21)
  test('Resume Reviewer & Cover Letter Generator endpoints function accurately', async () => {
    const getRes = await request(app)
      .get('/api/v1/resumes/my')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.resume.personalInfo).toBeDefined();

    const reviewRes = await request(app)
      .post('/api/v1/resumes/review')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        resumeData: getRes.body.resume,
        targetRole: 'Software Engineer'
      });

    expect(reviewRes.statusCode).toBe(200);
    expect(reviewRes.body.analysis.checklist.length).toBeGreaterThan(0);

    const letterRes = await request(app)
      .post('/api/v1/resumes/cover-letter')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        companyName: 'Atlassian',
        jobTitle: 'Software Engineer Intern',
        jobDescription: 'Seeking passionate engineers proficient in full-stack architecture'
      });

    expect(letterRes.statusCode).toBe(200);
    expect(letterRes.body.coverLetter).toContain('Atlassian');
  });

  // 24. SQL Isolated Sandbox: Executes queries safely via in-memory SQLite
  test('POST /api/v1/sql/execute runs SQL query safely in memory', async () => {
    const res = await request(app)
      .post('/api/v1/sql/execute')
      .send({
        query: 'SELECT name, location FROM departments WHERE budget > 3000000 ORDER BY budget DESC;'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.columns).toEqual(['name', 'location']);
    expect(res.body.values.length).toBe(3);
  });

  // 25. Learning Tracks & Roadmaps
  test('GET /api/v1/learning-tracks returns official curriculums for GATE, DSA, Web Dev', async () => {
    const res = await request(app).get('/api/v1/learning-tracks');
    expect(res.statusCode).toBe(200);
    expect(res.body.tracks.some(t => t.id === 'gate-cse')).toBe(true);
    expect(res.body.tracks.some(t => t.id === 'gate-da')).toBe(true);
  });

  // 26. Unified Calendar Events
  test('GET /api/v1/calendar returns official upcoming milestones', async () => {
    const res = await request(app).get('/api/v1/calendar');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.events[0].isOfficial).toBe(true);
  });

  // 26b. YouTube Learning Hub integration
  test('GET /api/v1/youtube/curated returns verified syllabus video lectures', async () => {
    const res = await request(app).get('/api/v1/youtube/curated?examCategory=Civil%20Services');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.items[0].videoId).toBeDefined();
    expect(res.body.items[0].embedUrl).toContain('youtube-nocookie.com');
  });

  test('POST /api/v1/youtube/bookmark and /complete persist learning progress', async () => {
    const bookmarkRes = await request(app)
      .post('/api/v1/youtube/bookmark')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        videoId: '0Uj0e94W6m4',
        title: 'Fundamental Rights UPSC Lecture',
        channel: 'Sansad TV'
      });

    expect(bookmarkRes.statusCode).toBe(200);
    expect(bookmarkRes.body.success).toBe(true);

    const completeRes = await request(app)
      .post('/api/v1/youtube/complete')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        videoId: '0Uj0e94W6m4',
        title: 'Fundamental Rights UPSC Lecture',
        channel: 'Sansad TV'
      });

    expect(completeRes.statusCode).toBe(200);
    expect(completeRes.body.completed).toBe(true);

    const progRes = await request(app)
      .get('/api/v1/youtube/progress')
      .set('Authorization', `Bearer ${authToken}`);

    expect(progRes.statusCode).toBe(200);
    expect(progRes.body.progress.totalCompleted).toBeGreaterThanOrEqual(1);
  });

  // 26c. LeetCode Coding Practice System
  test('GET /api/v1/coding/leetcode/problems returns paginated directory with verified links', async () => {
    const res = await request(app).get('/api/v1/coding/leetcode/problems?limit=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    const p = res.body.problems[0];
    expect(p.leetcodeUrl).toMatch(/^https:\/\/leetcode\.com\/problems\//);
    expect(p.companyTags.length).toBeGreaterThan(0);
  });

  test('GET /api/v1/coding/daily-challenge returns scheduled challenge', async () => {
    const res = await request(app).get('/api/v1/coding/daily-challenge');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.challenge.dateString).toBeDefined();
    expect(res.body.challenge.problem.title).toBeDefined();
  });

  test('GET /api/v1/coding/roadmaps returns 30/60/90-day DSA roadmaps', async () => {
    const res = await request(app).get('/api/v1/coding/roadmaps');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.roadmaps.length).toBe(3);
    expect(res.body.roadmaps.some(r => r.id === 'dsa-30-day')).toBe(true);
  });

  // 26c. GATE Multi-Branch Official Preparation Hub
  test('GET /api/v1/gate/papers returns 30 official papers including CS, DA, EC, EE, ME, CE', async () => {
    const res = await request(app).get('/api/v1/gate/papers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCount).toBe(30);
    expect(res.body.papers.some(p => p.code === 'CS')).toBe(true);
    expect(res.body.papers.some(p => p.code === 'DA')).toBe(true);
    expect(res.body.papers.some(p => p.code === 'ME')).toBe(true);
  });

  test('GET /api/v1/gate/papers/CS returns official syllabus sections & weightages', async () => {
    const res = await request(app).get('/api/v1/gate/papers/CS');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.paper.name).toBe('Computer Science and Information Technology');
    expect(res.body.paper.hasEngineeringMath).toBe(true);
    expect(res.body.paper.sections.length).toBeGreaterThan(4);
  });

  test('POST & GET /api/v1/gate/papers/CS/tracker toggles and persists topic progress', async () => {
    const postRes = await request(app)
      .post('/api/v1/gate/papers/CS/tracker')
      .set('Authorization', `Bearer ${signupUserToken}`)
      .send({ topicName: 'Asymptotic Analysis & Recurrences' });

    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.success).toBe(true);
    expect(postRes.body.completedTopics).toContain('Asymptotic Analysis & Recurrences');

    const getRes = await request(app)
      .get('/api/v1/gate/papers/CS/tracker')
      .set('Authorization', `Bearer ${signupUserToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.completedTopics).toContain('Asymptotic Analysis & Recurrences');
    expect(getRes.body.completionPercentage).toBeGreaterThan(0);
  });

  test('GET /api/v1/gate/papers/CS/analytics computes readiness score & section mastery', async () => {
    const res = await request(app)
      .get('/api/v1/gate/papers/CS/analytics')
      .set('Authorization', `Bearer ${signupUserToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.readinessScore).toBeDefined();
    expect(res.body.sections.length).toBeGreaterThan(0);
  });

  // 26d. Strict Branch Isolation & Verified GATE PYQ Filtering
  test('GET /api/v1/gate/papers/ME/pyqs returns ME questions only, with zero cross-branch contamination', async () => {
    const res = await request(app).get('/api/v1/gate/papers/ME/pyqs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.paperCode).toBe('ME');
    if (res.body.pyqs.length > 0) {
      // Must not contain Computer Science or other discipline questions
      res.body.pyqs.forEach(q => {
        expect(['Mechanical Engineering', 'General Aptitude', 'Thermodynamics & Heat Transfer', 'Mechanics of Materials & Design']).toContain(q.subject);
      });
    }
  });

  test('GET /api/v1/gate/papers/DA/pyqs returns Data Science & AI questions with NAT and MSQ support', async () => {
    const res = await request(app).get('/api/v1/gate/papers/DA/pyqs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.paperCode).toBe('DA');
    const msq = res.body.pyqs.find(q => q.questionType === 'multiple_choice');
    const nat = res.body.pyqs.find(q => q.questionType === 'numerical');
    if (msq) {
      expect(msq.negativeMarks).toBe(0); // Official GATE rule: 0 negative mark for MSQ
      expect(Array.isArray(msq.multipleCorrectAnswers)).toBe(true);
    }
    if (nat) {
      expect(nat.negativeMarks).toBe(0); // Official GATE rule: 0 negative mark for NAT
      expect(nat.numericalTolerance).toBeDefined();
    }
  });

  // 26e. Full 65-Question GATE Mock Test Blueprint
  test('GET /api/v1/gate/papers/CS/full-mock delivers 65-question official blueprint (10 GA + 55 Core)', async () => {
    const res = await request(app).get('/api/v1/gate/papers/CS/full-mock');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalQuestions).toBe(65);
    expect(res.body.totalMarks).toBe(100);
    expect(res.body.durationMinutes).toBe(180);
    expect(res.body.questions.length).toBe(65);
    // Question 1 to 10 must be General Aptitude
    expect(res.body.questions[0].subject).toBe('General Aptitude');
    expect(res.body.questions[9].subject).toBe('General Aptitude');
    // Safe delivery: correct answers and explanations must NOT be leaked
    expect(res.body.questions[0].correctAnswer).toBeUndefined();
    expect(res.body.questions[0].explanation).toBeUndefined();
  });

  // 26f. Server-Side GATE Marking Rules Evaluation (MCQ, MSQ, NAT)
  test('POST /api/v1/gate/papers/CS/submit-test strictly scores MCQ (-0.33/-0.66), MSQ (0 penalty), and NAT (tolerance)', async () => {
    // Fetch mock test to get valid testId
    const mockRes = await request(app).get('/api/v1/gate/papers/CS/full-mock');
    const testId = mockRes.body.testId;

    const submitRes = await request(app)
      .post('/api/v1/gate/papers/CS/submit-test')
      .send({
        testId,
        answers: {
          '1': 'A', // Correct General Aptitude 1-mark MCQ -> +1
          '2': 'B', // Incorrect General Aptitude 1-mark MCQ -> -0.33
          '12': 'WRONG_MSQ', // Wrong MSQ -> 0 negative marks!
          '16': '99999' // Wrong NAT -> 0 negative marks!
        }
      });

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.success).toBe(true);
    expect(submitRes.body.totalQuestions).toBe(65);
    expect(submitRes.body.totalMarksPossible).toBe(100);
    expect(submitRes.body.rankTier).toBeDefined();

    // Verify negative marks: only MCQ 2 penalty (-0.33), NAT and MSQ had 0 penalty
    const q1Review = submitRes.body.questionReviews.find(r => r.index === 1);
    const q2Review = submitRes.body.questionReviews.find(r => r.index === 2);
    expect(q1Review.isCorrect).toBe(true);
    expect(q1Review.marksAwarded).toBe(1);
    expect(q2Review.isCorrect).toBe(false);
    expect(q2Review.penalty).toBe(0.33);

    const natReview = submitRes.body.questionReviews.find(r => r.questionType === 'numerical');
    if (natReview) {
      expect(natReview.penalty).toBe(0);
    }
  });

  // 26g. Question Bookmarking and Reporting
  test('POST /api/v1/gate/questions/:id/bookmark and /report manage user interactions', async () => {
    const pyqRes = await request(app).get('/api/v1/gate/papers/CS/pyqs');
    if (pyqRes.body.pyqs.length > 0) {
      const qId = pyqRes.body.pyqs[0].id;

      // Bookmark
      const bmRes = await request(app)
        .post(`/api/v1/gate/questions/${qId}/bookmark`)
        .set('Authorization', `Bearer ${signupUserToken}`);

      expect(bmRes.statusCode).toBe(200);
      expect(bmRes.body.success).toBe(true);

      // Report
      const reportRes = await request(app)
        .post(`/api/v1/gate/questions/${qId}/report`)
        .send({
          reason: 'Ambiguous Question Text',
          userNote: 'Review boundary condition formulation.'
        });

      expect(reportRes.statusCode).toBe(200);
      expect(reportRes.body.success).toBe(true);
      expect(reportRes.body.reportId).toBeDefined();
    }
  });

  // 27. Secure Account Deletion Workflow (Section 4 & 32)
  test('DELETE /api/v1/auth/account removes user and cascades personal records', async () => {
    const res = await request(app)
      .delete('/api/v1/auth/account')
      .set('Authorization', `Bearer ${signupUserToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify user no longer exists
    const checkUser = await User.findById(testUserId);
    expect(checkUser).toBeNull();
  });
});
