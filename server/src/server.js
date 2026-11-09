require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');

const app = require('./app');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/envValidator');
const setupQuizSocket = require('./sockets/quizSocket');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Live Quiz Real-time Socket handlers
setupQuizSocket(io);

// Scheduled background job: Daily 100-Question Quiz pipeline
// Default timezone: Asia/Kolkata (runs midnight 00:00 IST)
cron.schedule('0 0 * * *', async () => {
  console.log('[Scheduler] Executing scheduled All-India Daily 100-Question Quiz generation (Asia/Kolkata)...');
  try {
    const today = new Date();
    const approvedQuestions = await Question.find({ validationStatus: 'approved' }).limit(100);

    if (approvedQuestions.length > 0) {
      await Quiz.create({
        title: `All-India Daily Grand Quiz - ${today.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        hindiTitle: `अखिल भारतीय दैनिक महा-क्विज़ - ${today.toLocaleDateString('hi-IN', { timeZone: 'Asia/Kolkata' })}`,
        description: 'Scheduled daily mock examination generated and validated by AspirantAI.',
        hindiDescription: 'दैनिक अखिल भारतीय अभ्यास परीक्षा।',
        examCategory: 'General Knowledge & Current Affairs',
        totalQuestions: approvedQuestions.length,
        durationMinutes: 120,
        positiveMarks: 2,
        negativeMarks: 0.66,
        isDaily: true,
        questions: approvedQuestions.map(q => q._id),
        scheduledFor: today
      });
      console.log(`[Scheduler] Daily Quiz generated with ${approvedQuestions.length} validated questions.`);
    }
  } catch (err) {
    console.error('[Scheduler Error]', err.message);
  }
}, {
  timezone: 'Asia/Kolkata'
});

// Start Server
const startServer = async () => {
  validateEnv();
  await connectDB();

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  [PORT CONFLICT] Port ${PORT} is already in use by a background process.`);
      console.error(`👉 Freeing port ${PORT} automatically...`);
      require('child_process').exec(`lsof -ti :${PORT} | xargs kill -9 2>/dev/null || true`, () => {
        console.log(`✅ Port ${PORT} cleared. Starting fresh on next attempt.\n`);
        process.exit(1);
      });
    } else {
      console.error('[Server Error]', err);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 AspirantAI Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`👨‍💻 Developed by Abhishek Kumar (MERN Stack Developer)`);
    console.log(`📖 API Docs available at: http://localhost:${PORT}/api/docs`);
    console.log(`====================================================`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, server };
