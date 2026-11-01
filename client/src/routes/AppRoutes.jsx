import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Core & Authentication Pages
import LandingPage from '../features/dashboard/LandingPage';
import FeaturesPage from '../features/dashboard/FeaturesPage';
import AboutPage from '../features/dashboard/AboutPage';
import DeveloperProfilePage from '../features/profile/DeveloperProfilePage';
import SignupPage from '../features/auth/SignupPage';
import LoginPage from '../features/auth/LoginPage';
import OAuthCallbackPage from '../features/auth/OAuthCallbackPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import OnboardingPage from '../features/onboarding/OnboardingPage';
import DashboardPage from '../features/dashboard/DashboardPage';

// Exams & Syllabus
import ExamDirectoryPage from '../features/exams/ExamDirectoryPage';
import ExamDetailsPage from '../features/exams/ExamDetailsPage';
import SyllabusPage from '../features/exams/SyllabusPage';

// Quizzes, CBT & Tests
import DailyQuizPage from '../features/dailyQuiz/DailyQuizPage';
import LiveQuizPage from '../features/liveQuiz/LiveQuizPage';
import MockTestsPage from '../features/mockTests/MockTestsPage';
import PYQPage from '../features/mockTests/PYQPage';
import CbtSimulatorPage from '../features/mockTests/CbtSimulatorPage';

// Boards
import Class10BoardPage from '../features/boards/Class10BoardPage';
import Class12BoardPage from '../features/boards/Class12BoardPage';

// AI Tutor Suite
import DoubtSolverPage from '../features/aiTutor/DoubtSolverPage';
import StudyCoachPage from '../features/aiTutor/StudyCoachPage';
import VoiceTutorPage from '../features/voiceTutor/VoiceTutorPage';
import ImageQuestionSolverPage from '../features/questionSolver/ImageQuestionSolverPage';
import PdfAnalyzerPage from '../features/pdfAnalyzer/PdfAnalyzerPage';

// Study Tools & Revision
import StudyPlannerPage from '../features/studyPlanner/StudyPlannerPage';
import FlashcardsPage from '../features/flashcards/FlashcardsPage';
import MistakeNotebookPage from '../features/mistakeNotebook/MistakeNotebookPage';
import RevisionCenterPage from '../features/revision/RevisionCenterPage';
import QuestionPaperGeneratorPage from '../features/questionPaperGenerator/QuestionPaperGeneratorPage';

// Performance & Vacancies
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import VacancyTrackerPage from '../features/vacancies/VacancyTrackerPage';

// Social & Notifications
import StudyGroupsPage from '../features/studyGroups/StudyGroupsPage';
import CommunityPage from '../features/community/CommunityPage';
import NotificationsPage from '../features/notifications/NotificationsPage';

// User Account & Administration
import ProfileSettingsPage from '../features/profile/ProfileSettingsPage';
import DataExportPage from '../features/profile/DataExportPage';
import AdminDashboardPage from '../features/admin/AdminDashboardPage';
import ContentManagerPage from '../features/contentManager/ContentManagerPage';

// Coding, Career, Interviews & Tools
import CodingPracticePage from '../features/coding/CodingPracticePage';
import AiCodingAssistantPage from '../features/coding/AiCodingAssistantPage';
import InternshipPortalPage from '../features/careers/InternshipPortalPage';
import JobPortalPage from '../features/careers/JobPortalPage';
import ApplicationTrackerPage from '../features/careers/ApplicationTrackerPage';
import ResumeBuilderPage from '../features/resume/ResumeBuilderPage';
import CoverLetterPage from '../features/resume/CoverLetterPage';
import InterviewPrepPage from '../features/interviews/InterviewPrepPage';
import GatePrepPage from '../features/gate/GatePrepPage';
import RoadmapsPage from '../features/roadmaps/RoadmapsPage';
import AiNotesPage from '../features/notes/AiNotesPage';
import SqlPracticePage from '../features/sql/SqlPracticePage';
import ExamCalendarPage from '../features/calendar/ExamCalendarPage';
import ProjectLabPage from '../features/projects/ProjectLabPage';
import YouTubeLibraryPage from '../features/learningLibrary/YouTubeLibraryPage';

// Legal & Support
import PrivacyPolicyPage from '../features/dashboard/PrivacyPolicyPage';
import TermsPage from '../features/dashboard/TermsPage';
import HelpSupportPage from '../features/dashboard/HelpSupportPage';
import NotFoundPage from '../features/dashboard/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Core & Landing */}
        <Route index element={<LandingPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="developer" element={<DeveloperProfilePage />} />
        <Route path="portfolio" element={<DeveloperProfilePage />} />

        {/* Authentication & Verification */}
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/callback" element={<OAuthCallbackPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        {/* Deprecated OTP routes redirecting cleanly */}
        <Route path="verify-email" element={<Navigate to="/dashboard" replace />} />
        <Route path="verify-mobile" element={<Navigate to="/dashboard" replace />} />

        {/* Onboarding & Dashboard */}
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Exams & Syllabus */}
        <Route path="exams" element={<ExamDirectoryPage />} />
        <Route path="exams/:code" element={<ExamDetailsPage />} />
        <Route path="syllabus" element={<SyllabusPage />} />

        {/* Quizzes, Tests & CBT Simulation */}
        <Route path="daily-quiz" element={<DailyQuizPage />} />
        <Route path="live-quiz" element={<LiveQuizPage />} />
        <Route path="mock-tests" element={<MockTestsPage />} />
        <Route path="mock-tests/cbt" element={<CbtSimulatorPage />} />
        <Route path="mock-tests/cbt/:id" element={<CbtSimulatorPage />} />
        <Route path="cbt" element={<CbtSimulatorPage />} />
        <Route path="pyq" element={<PYQPage />} />
        <Route path="cbt-simulator" element={<CbtSimulatorPage />} />
        <Route path="cbt-simulator/:id" element={<CbtSimulatorPage />} />

        {/* Boards */}
        <Route path="boards/class-10" element={<Class10BoardPage />} />
        <Route path="boards/class-12" element={<Class12BoardPage />} />

        {/* AI Tutor Suite */}
        <Route path="ai-tutor/doubts" element={<DoubtSolverPage />} />
        <Route path="ai-tutor/coach" element={<StudyCoachPage />} />
        <Route path="ai-tutor/voice" element={<VoiceTutorPage />} />
        <Route path="ai-tutor/image-solver" element={<ImageQuestionSolverPage />} />
        <Route path="ai-tutor/pdf-analyzer" element={<PdfAnalyzerPage />} />

        {/* Study Tools & Revision */}
        <Route path="study-planner" element={<StudyPlannerPage />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="mistake-notebook" element={<MistakeNotebookPage />} />
        <Route path="revision" element={<RevisionCenterPage />} />
        <Route path="paper-generator" element={<QuestionPaperGeneratorPage />} />

        {/* Performance & Vacancies */}
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="vacancies" element={<VacancyTrackerPage />} />

        {/* Social & Notifications */}
        <Route path="study-groups" element={<StudyGroupsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="notifications" element={<NotificationsPage />} />

        {/* User Account & Management */}
        <Route path="profile" element={<ProfileSettingsPage />} />
        <Route path="data-export" element={<DataExportPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="content-manager" element={<ContentManagerPage />} />

        {/* Coding & Tech Suite */}
        <Route path="coding" element={<CodingPracticePage />} />
        <Route path="coding/assistant" element={<AiCodingAssistantPage />} />
        <Route path="sql-workspace" element={<SqlPracticePage />} />
        <Route path="projects" element={<ProjectLabPage />} />
        <Route path="roadmaps" element={<RoadmapsPage />} />
        <Route path="learning-library" element={<YouTubeLibraryPage />} />

        {/* Careers & Jobs */}
        <Route path="internships" element={<InternshipPortalPage />} />
        <Route path="jobs" element={<JobPortalPage />} />
        <Route path="applications" element={<ApplicationTrackerPage />} />
        <Route path="resume-builder" element={<ResumeBuilderPage />} />
        <Route path="cover-letter" element={<CoverLetterPage />} />
        <Route path="interview-prep" element={<InterviewPrepPage />} />

        {/* GATE Multi-Branch Preparation */}
        <Route path="gate" element={<GatePrepPage />} />
        <Route path="gate/:code" element={<GatePrepPage />} />
        <Route path="ai-notes" element={<AiNotesPage />} />
        <Route path="calendar" element={<ExamCalendarPage />} />

        {/* Legal & Support */}
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="support" element={<HelpSupportPage />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
