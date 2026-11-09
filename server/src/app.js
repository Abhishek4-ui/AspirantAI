require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const swaggerDocs = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const examRoutes = require('./routes/examRoutes');
const boardRoutes = require('./routes/boardRoutes');
const dailyQuizRoutes = require('./routes/dailyQuizRoutes');
const liveQuizRoutes = require('./routes/liveQuizRoutes');
const aiServicesRoutes = require('./routes/aiServicesRoutes');
const studyPlannerRoutes = require('./routes/studyPlannerRoutes');
const mistakeNotebookRoutes = require('./routes/mistakeNotebookRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const vacancyRoutes = require('./routes/vacancyRoutes');
const studyGroupRoutes = require('./routes/studyGroupRoutes');
const communityRoutes = require('./routes/communityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const questionPaperRoutes = require('./routes/questionPaperRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Career, Coding, Learning & Tooling Routes
const codingRoutes = require('./routes/codingRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationTrackerRoutes = require('./routes/applicationTrackerRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const notesRoutes = require('./routes/notesRoutes');
const projectRoutes = require('./routes/projectRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const sqlPracticeRoutes = require('./routes/sqlPracticeRoutes');
const learningTrackRoutes = require('./routes/learningTrackRoutes');
const questionRoutes = require('./routes/questionRoutes');
const mockTestRoutes = require('./routes/mockTestRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const youtubeLearningRoutes = require('./routes/youtubeLearningRoutes');
const gateRoutes = require('./routes/gateRoutes');

const app = express();

// Trust reverse proxy (Vercel, Render, Cloudflare load balancers)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://aspirantai.vercel.app',
  'https://aspirant-ai.vercel.app',
  ...configuredOrigins
];

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const normalized = origin.trim().replace(/\/$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  // Match any *.vercel.app deployment (production and preview branches)
  if (/^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(normalized)) return true;
  // Match any *.onrender.com deployment
  if (/^https:\/\/[a-zA-Z0-9-_.]+\.onrender\.com$/.test(normalized)) return true;
  // Match local network and localhost on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(normalized)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root Confirmation & Status Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    application: 'AspirantAI Backend API',
    status: 'running',
    version: '1.0.0',
    creator: 'Abhishek Kumar (MERN Stack Developer)',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    documentation: '/api/v1/docs',
    health: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      exams: '/api/v1/exams',
      dailyQuiz: '/api/v1/daily-quiz/today',
      mockTests: '/api/v1/mock-tests',
      gate: '/api/v1/gate/papers',
      coding: '/api/v1/coding/problems'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'AspirantAI API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'AspirantAI API',
    version: '1.0.0',
    creator: 'Abhishek Kumar (MERN Stack Developer)',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: 'Connected'
  });
});

// Apply API rate limiting
app.use('/api/v1', apiLimiter);

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/boards', boardRoutes);
app.use('/api/v1/daily-quiz', dailyQuizRoutes);
app.use('/api/v1/live-quiz', liveQuizRoutes);
app.use('/api/v1/ai-services', aiServicesRoutes);
app.use('/api/v1/study-planner', studyPlannerRoutes);
app.use('/api/v1/mistake-notebook', mistakeNotebookRoutes);
app.use('/api/v1/flashcards', flashcardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/vacancies', vacancyRoutes);
app.use('/api/v1/study-groups', studyGroupRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/question-paper', questionPaperRoutes);
app.use('/api/v1/admin', adminRoutes);

// Career, Coding, Learning & Tooling Routes
app.use('/api/v1/coding', codingRoutes);
app.use('/api/v1/internships', internshipRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationTrackerRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/sql', sqlPracticeRoutes);
app.use('/api/v1/learning-tracks', learningTrackRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/mock-tests', mockTestRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/youtube', youtubeLearningRoutes);
app.use('/api/v1/gate', gateRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
