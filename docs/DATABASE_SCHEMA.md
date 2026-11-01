# AspirantAI Database Schema Documentation

## Mongoose Collections & Data Models

### 1. User
- `name`: String (Required, trimmed)
- `email`: String (Unique, indexed, lowercase)
- `mobile`: String (Unique, indexed)
- `password`: String (bcrypt hashed, `select: false`)
- `role`: Enum `['student', 'contentManager', 'admin']` (Default: `student`)
- `isEmailVerified`: Boolean
- `isMobileVerified`: Boolean
- `preferredLanguage`: Enum `['en', 'hi']`
- `onboardingCompleted`: Boolean
- `primaryExamId`: String
- `preparationGoals`: [String]
- `educationProfile`: { board, session, classLevel, stream, subjects }
- `studyPreferences`: { targetHoursPerDay, dailyQuizNotification, targetExamDate }
- `streak`: { current, max, lastActiveDate }
- `xp`: Number

### 2. Question
- `questionText`: String
- `questionHindi`: String
- `options`: [{ key: 'A'|'B'|'C'|'D', text }]
- `optionsHindi`: [{ key: 'A'|'B'|'C'|'D', text }]
- `correctAnswer`: 'A'|'B'|'C'|'D'
- `explanation`: String
- `explanationHindi`: String
- `examCategory`: String (Indexed)
- `subject`: String (Indexed)
- `topic`: String
- `difficulty`: Enum `['easy', 'medium', 'hard']`
- `validationStatus`: Enum `['approved', 'pending_review', 'flagged']`

### 3. Quiz & QuizAttempt
- `Quiz`: title, hindiTitle, totalQuestions, durationMinutes, positiveMarks, negativeMarks, isDaily, scheduledFor, questions ref.
- `QuizAttempt`: quizId, userId, startedAt, submittedAt, isCompleted, timeSpentSeconds, score, accuracyPercentage, totalCorrect, totalWrong, totalUnanswered, topicBreakdown.

### 4. Spaced Repetition (Flashcard)
- `Flashcard`: userId, subject, topic, front, back, hindiFront, hindiBack, repetitions, interval (days), easeFactor, nextReviewDate.

### 5. Vacancy
- `Vacancy`: organization, post, totalVacancies, notificationNumber, category, qualification, applicationStartDate, applicationEndDate, examDate, officialNotificationUrl, source, isVerified.
