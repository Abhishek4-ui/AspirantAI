# AspirantAI REST API Reference

All REST endpoints operate under the root `/api/v1`. Interactive Swagger UI is hosted at `http://localhost:5000/api/docs`.

### Authentication Endpoints
- `POST /api/v1/auth/signup` - Register a new aspirant account
- `POST /api/v1/auth/login` - Authenticate via email/mobile and password
- `POST /api/v1/auth/send-otp` - Send a 6-digit verification code
- `POST /api/v1/auth/verify-otp` - Verify 6-digit OTP challenge
- `GET /api/v1/auth/me` - Retrieve authenticated user session

### Onboarding & Preferences
- `POST /api/v1/onboarding/preferences` - Set primary exam, preparation goals, and study target
- `GET /api/v1/onboarding/options` - Supported exam categories and board stream choices

### All-India Exams & Boards
- `GET /api/v1/exams` - Filter and retrieve verified competitive exams
- `GET /api/v1/exams/:code` - Detailed exam pattern, qualification, and syllabus
- `GET /api/v1/boards/:boardCode/:classLevel` - Board syllabus, streams, notes, and formulas

### Daily & Live Quizzes
- `GET /api/v1/daily-quiz/today` - Today's 100-question quiz (sanitized without answers)
- `POST /api/v1/daily-quiz/:id/submit` - Server-evaluated test submission with negative marking
- `GET /api/v1/live-quiz/sessions` - Active real-time challenge rooms
- `POST /api/v1/live-quiz/create` - Host a live quiz session

### AI Services
- `POST /api/v1/ai-services/doubt-solver` - Hindi/English conceptual step-by-step solver
- `POST /api/v1/ai-services/image-solver` - OCR text extraction and numerical resolution
- `POST /api/v1/ai-services/pdf-analyzer` - Document concept extraction and practice test builder
- `POST /api/v1/ai-services/study-coach` - Personalized syllabus velocity insights

### Study Tools & Analytics
- `GET /api/v1/study-planner` - Retrieve daily tasks and countdown milestones
- `POST /api/v1/flashcards/:id/review` - Spaced repetition SM-2 rating calculation
- `GET /api/v1/mistake-notebook` - User incorrect questions log
- `POST /api/v1/question-paper/generate` - Dynamic question paper generation
- `GET /api/v1/analytics/overview` - Accuracy trend and readiness metrics
- `GET /api/v1/vacancies` - Gazette-verified government vacancies
