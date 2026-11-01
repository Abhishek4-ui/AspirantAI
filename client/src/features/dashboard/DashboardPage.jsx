import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Sparkles, Award, Zap, TrendingUp, Clock, Calendar,
  ArrowRight, ShieldCheck, Flame, BookOpen, Layers,
  ExternalLink, Target, FileText, CheckCircle2, Play,
  Video, Code, Compass, RefreshCw, BarChart3, AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { MASTER_EXAM_CATALOG } from '../../constants/examCatalog';

const DASHBOARD_EXAMS = MASTER_EXAM_CATALOG;

export default function DashboardPage() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Card A: Daily AI Quiz State
  const [quizExamCode, setQuizExamCode] = useState(user?.primaryExamId || 'UPSC_CSE');
  const [quizLang, setQuizLang] = useState('en');
  const [quizAttemptStatus, setQuizAttemptStatus] = useState('not_started'); // 'not_started', 'in_progress', 'completed'
  const [quizScore, setQuizScore] = useState(null);

  // Card B: Daily CBT Mock Test State
  const [cbtExamCode, setCbtExamCode] = useState(user?.primaryExamId || 'UPSC_CSE');
  const [cbtLang, setCbtLang] = useState('en');
  const [cbtAttemptStatus, setCbtAttemptStatus] = useState('not_started');
  const [cbtScore, setCbtScore] = useState(null);

  // Card C & D: YouTube & LeetCode Integrations
  const [topLecture, setTopLecture] = useState(null);
  const [dailyProblem, setDailyProblem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchQuizStatus();
  }, [quizExamCode, quizLang]);

  useEffect(() => {
    fetchCbtStatus();
  }, [cbtExamCode, cbtLang]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, vacRes, ytRes, codeRes] = await Promise.all([
        api.get('/analytics/overview').catch(() => ({ data: { success: false } })),
        api.get('/vacancies?category=All').catch(() => ({ data: { success: false } })),
        api.get('/youtube/curated').catch(() => ({ data: { success: false } })),
        api.get('/coding/daily-challenge').catch(() => ({ data: { success: false } }))
      ]);

      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data);
      }
      if (vacRes.data.success && vacRes.data.vacancies) {
        setVacancies(vacRes.data.vacancies.slice(0, 3));
      }
      if (ytRes.data.success && ytRes.data.items?.length > 0) {
        setTopLecture(ytRes.data.items[0]);
      }
      if (codeRes.data.success && codeRes.data.challenge?.problem) {
        setDailyProblem(codeRes.data.challenge.problem);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStatus = async () => {
    try {
      const res = await api.get('/daily-quiz/today', {
        params: { examCode: quizExamCode, language: quizLang }
      });
      if (res.data.success) {
        if (res.data.completedAttempt) {
          setQuizAttemptStatus('completed');
          setQuizScore(res.data.completedAttempt.score);
        } else if (res.data.activeAttempt) {
          setQuizAttemptStatus('in_progress');
        } else {
          setQuizAttemptStatus('not_started');
        }
      }
    } catch (err) {
      setQuizAttemptStatus('not_started');
    }
  };

  const fetchCbtStatus = async () => {
    try {
      const res = await api.get('/mock-tests/daily-cbt', {
        params: { examCode: cbtExamCode, language: cbtLang }
      });
      if (res.data.success) {
        if (res.data.completedAttempt) {
          setCbtAttemptStatus('completed');
          setCbtScore(res.data.completedAttempt.score);
        } else if (res.data.activeAttempt) {
          setCbtAttemptStatus('in_progress');
        } else {
          setCbtAttemptStatus('not_started');
        }
      }
    } catch (err) {
      setCbtAttemptStatus('not_started');
    }
  };

  // Real user metrics without fake fallbacks
  const hasAnalyticsData = analytics?.performanceTrend && analytics.performanceTrend.length > 0;
  const readinessScore = analytics?.metrics?.readinessScore ?? 0;
  const totalCorrect = analytics?.metrics?.totalCorrect ?? 0;
  const averageAccuracy = analytics?.metrics?.averageAccuracy ?? 0;
  const streakDays = user?.streak?.current || 0;
  const xpPoints = user?.xp || 0;
  const primaryGoal = user?.primaryExamId || 'All-India Competitive Exam';

  const currentCbtConfig = DASHBOARD_EXAMS.find(e => e.code === cbtExamCode) || DASHBOARD_EXAMS[0];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 relative overflow-hidden bg-white/80 dark:bg-navy-950/80 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target: {primaryGoal.replace(/_/g, ' ')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Namaste, {user?.name || 'Aspirant'}! 🇮🇳
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Track your authentic preparation milestones. Take today's 100-Question Grand Quiz or simulate an official 50-Question CBT examination.
            </p>
          </div>

          {/* Real Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 dark:text-white">{streakDays} Days</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Daily Streak</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 dark:text-white">{xpPoints} XP</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Earned XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Daily Quiz', path: '/daily-quiz', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'CBT Mock Test', path: '/cbt-simulator', icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'GATE 30 Papers', path: '/gate', icon: Compass, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Coding Sandbox', path: '/coding', icon: Code, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Study Coach', path: '/ai-tutor/coach', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'YouTube Hub', path: '/learning-library', icon: Video, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="p-3.5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all flex flex-col items-center text-center gap-2 group"
            >
              <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* CORE ASSESSMENT SUITE: CARD A & CARD B (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD A: DAILY AI QUIZ (100 QUESTIONS) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> DAILY AI QUIZ
              </span>
              <span className="text-[11px] text-blue-600 dark:text-neon-cyan font-bold">100 Questions • 120 Mins</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              All-India Daily Grand Quiz
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Comprehensive 100-question multi-topic daily assessment with server scoring, live attempt resume on refresh, and conceptual derivations.
            </p>

            {/* Config Selectors: Exam & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Target Examination</label>
                <select
                  value={quizExamCode}
                  onChange={(e) => setQuizExamCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  {Object.entries(
                    DASHBOARD_EXAMS.reduce((acc, ex) => {
                      const grp = ex.group || ex.category || 'Other';
                      if (!acc[grp]) acc[grp] = [];
                      acc[grp].push(ex);
                      return acc;
                    }, {})
                  ).map(([groupName, groupExams]) => (
                    <optgroup key={groupName} label={groupName} className="bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300">
                      {groupExams.map(ex => (
                        <option key={ex.code} value={ex.code} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                          {ex.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Language Edition</label>
                <select
                  value={quizLang}
                  onChange={(e) => setQuizLang(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-neon-cyan focus:outline-none"
                >
                  <option value="en">English Edition</option>
                  <option value="hi">हिन्दी संस्करण</option>
                </select>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 mb-6 py-3 border-y border-slate-200 dark:border-slate-800 text-center">
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">100</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Questions</div>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-800">
                <div className="text-lg font-black text-blue-600 dark:text-neon-cyan">200</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Max Marks</div>
              </div>
              <div>
                <div className="text-lg font-black text-amber-500">0.66</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Negative Marking</div>
              </div>
            </div>
          </div>

          {/* Action Button depending on status */}
          <div className="flex items-center gap-3 pt-2">
            {quizAttemptStatus === 'completed' ? (
              <Link
                to={`/daily-quiz?examCode=${quizExamCode}&lang=${quizLang}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Quiz Score ({quizScore} Marks) & Solutions</span>
              </Link>
            ) : quizAttemptStatus === 'in_progress' ? (
              <Link
                to={`/daily-quiz?examCode=${quizExamCode}&lang=${quizLang}`}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition"
              >
                <Clock className="w-4 h-4 animate-spin" />
                <span>Resume Active Quiz (Progress Saved)</span>
              </Link>
            ) : (
              <Link
                to={`/daily-quiz?examCode=${quizExamCode}&lang=${quizLang}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start 100-Question Grand Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* CARD B: DAILY CBT MOCK TEST (50 QUESTIONS) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-extrabold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> DAILY CBT MOCK TEST
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-300 font-bold">50 MCQs • NTA/TCS-iON Pattern</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Official CBT Exam Simulation
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Daily 50-question mock with authentic color palette (Answered, Marked, Unvisited), countdown timer, negative marking, and real-time backend persistence.
            </p>

            {/* Config Selectors: Exam & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Target Examination</label>
                <select
                  value={cbtExamCode}
                  onChange={(e) => setCbtExamCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  {Object.entries(
                    DASHBOARD_EXAMS.reduce((acc, ex) => {
                      const grp = ex.group || ex.category || 'Other';
                      if (!acc[grp]) acc[grp] = [];
                      acc[grp].push(ex);
                      return acc;
                    }, {})
                  ).map(([groupName, groupExams]) => (
                    <optgroup key={groupName} label={groupName} className="bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300">
                      {groupExams.map(ex => (
                        <option key={ex.code} value={ex.code} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                          {ex.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Language Edition</label>
                <select
                  value={cbtLang}
                  onChange={(e) => setCbtLang(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-300 focus:outline-none"
                >
                  <option value="en">English Edition</option>
                  <option value="hi">हिन्दी संस्करण</option>
                </select>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 mb-6 py-3 border-y border-slate-200 dark:border-slate-800 text-center">
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">50</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">CBT Questions</div>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-800">
                <div className="text-lg font-black text-purple-600 dark:text-purple-400">{currentCbtConfig.time}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Exam Duration</div>
              </div>
              <div>
                <div className="text-lg font-black text-red-500">-{currentCbtConfig.negative}</div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Negative Marking</div>
              </div>
            </div>
          </div>

          {/* Action Button depending on status */}
          <div className="flex items-center gap-3 pt-2">
            {cbtAttemptStatus === 'completed' ? (
              <Link
                to={`/cbt-simulator?examCode=${cbtExamCode}&lang=${cbtLang}`}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Review Completed CBT Result ({cbtScore} Marks)</span>
              </Link>
            ) : cbtAttemptStatus === 'in_progress' ? (
              <Link
                to={`/cbt-simulator?examCode=${cbtExamCode}&lang=${cbtLang}`}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition"
              >
                <Clock className="w-4 h-4 animate-spin" />
                <span>Resume CBT Console (Progress Saved)</span>
              </Link>
            ) : (
              <Link
                to={`/cbt-simulator?examCode=${cbtExamCode}&lang=${cbtLang}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start 50-Question CBT Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* SECONDARY ROW: YOUTUBE LEARNING & LEETCODE CODING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD C: YOUTUBE LEARNING HUB */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-extrabold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> YOUTUBE LEARNING
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">Live Curated Playlists</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Syllabus Video Lecture Hub</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Stream verified high-yield playlists, previous-year question solutions, and comprehensive courses for your target examination.
              </p>
            </div>

            {topLecture ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 relative">
                  <img src={topLecture.thumbnail} alt={topLecture.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{topLecture.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{topLecture.channel} • {topLecture.subject}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Loading syllabus recommendations...</div>
            )}
          </div>

          <div className="pt-5">
            <Link
              to="/learning-library"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span>Explore YouTube Learning Library</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CARD D: LEETCODE CODING PRACTICE */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> CODING & DSA PRACTICE
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-300 font-bold">Blind 75 & NeetCode 150</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Daily Coding Challenge & Sandbox</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Solve top interview coding problems with verified LeetCode links, sandboxed Monaco execution, and structured DSA roadmaps.
              </p>
            </div>

            {dailyProblem ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">#{dailyProblem.leetcodeNumber || 'Daily'}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{dailyProblem.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      {dailyProblem.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-500">{dailyProblem.topic || dailyProblem.category}</span>
                  </div>
                </div>

                <Link
                  to="/coding"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex-shrink-0"
                >
                  Solve
                </Link>
              </div>
            ) : (
              <div className="text-xs text-slate-500">Loading daily challenge...</div>
            )}
          </div>

          <div className="pt-5">
            <Link
              to="/coding"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-blue-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Code className="w-4 h-4" />
              <span>Launch LeetCode Practice & Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* GATE ALL-BRANCH PORTAL HIGHLIGHT */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-blue-500/30 bg-gradient-to-r from-blue-50 via-slate-50 to-purple-50 dark:from-blue-950/40 dark:via-purple-950/30 dark:to-navy-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-neon-cyan" /> OFFICIAL GATE 30-PAPER HUB
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">GATE 2026 / 2025</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Full GATE Preparation for Every Engineering Branch</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Topic-wise syllabus trackers, verified official PYQs, 65-question timed CBT simulators, and engineering mathematics practice for CS, DA, EC, EE, ME, CE, CH, IN, BT, and 21 other branches.
          </p>
        </div>

        <Link
          to="/gate"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs sm:text-sm whitespace-nowrap shadow-md flex items-center gap-2 flex-shrink-0"
        >
          <span>Open GATE Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Real Progress Analytics & Accuracy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Accuracy Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-neon-cyan" /> Assessment Accuracy Trend
                </h3>
                <p className="text-xs text-slate-500">Tracking accuracy and score progression across tests</p>
              </div>
              {hasAnalyticsData && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                  Readiness: {readinessScore}%
                </span>
              )}
            </div>

            {hasAnalyticsData ? (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.performanceTrend}>
                    <defs>
                      <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="quizNumber" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#0066FF" strokeWidth={2.5} fillOpacity={1} fill="url(#accuracyGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              /* Clean Empty State without fake charts */
              <div className="py-12 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Assessment History Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your performance analytics and accuracy trend will appear here as soon as you complete your first practice test or CBT mock.
                </p>
                <div className="pt-2">
                  <Link
                    to="/daily-quiz"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm"
                  >
                    Take First Practice Test <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Readiness Breakdown Widget */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600 dark:text-neon-cyan" /> Competitive Readiness
              </h3>
              <span className="text-xs font-bold text-blue-600 dark:text-neon-cyan">{readinessScore}%</span>
            </div>

            <div className="relative flex items-center justify-center py-6">
              <div className="w-36 h-36 rounded-full border-4 border-slate-200 dark:border-navy-800 flex items-center justify-center relative">
                <div className="text-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{readinessScore}%</span>
                  <div className="text-[10px] text-blue-600 dark:text-neon-cyan font-bold uppercase mt-0.5">National Index</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {readinessScore > 0
                ? 'Based on your quiz completion, accuracy under negative marking, and consistency across subjects.'
                : 'Complete your first practice test to calculate your official readiness score.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/analytics"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              View Detailed Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
