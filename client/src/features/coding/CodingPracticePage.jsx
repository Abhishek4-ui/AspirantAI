import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Code, Play, Send, CheckCircle2, AlertCircle, Clock,
  HardDrive, Filter, BookOpen, Sparkles, ChevronRight, RefreshCw,
  ExternalLink, Bookmark, BookmarkCheck, Flame, Award, Calendar,
  Layers, Terminal, Check, RotateCcw, Search, Compass, Cpu, Zap
} from 'lucide-react';

const STARTER_CODES = {
  javascript: '// JavaScript (Node.js)\nfunction solve(nums, target) {\n  // Write your solution here\n  return [];\n}',
  python: '# Python 3\ndef solve(nums, target):\n    # Write your solution here\n    return []',
  java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Read input and print output\n    }\n}',
  cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}'
};

export default function CodingPracticePage() {
  const { user } = useAuth();
  
  // Navigation Tabs: 'editor' | 'directory' | 'daily' | 'roadmaps' | 'ai-generator'
  const [activeTab, setActiveTab] = useState('directory');

  // LeetCode Directory Explorer State
  const [directoryProblems, setDirectoryProblems] = useState([]);
  const [dirLoading, setDirLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topicsList, setTopicsList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  // Active Problem & Code Editor State
  const [activeProblem, setActiveProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_CODES.javascript);
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [consoleTab, setConsoleTab] = useState('testcases'); // 'testcases' | 'output' | 'submissions'
  const [submissionsHistory, setSubmissionsHistory] = useState([]);

  // Daily Challenge State
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);

  // DSA Roadmaps State
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(false);

  // AI Generator Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('Arrays');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiCompany, setAiCompany] = useState('Google');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Bookmarks & User Progress State
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [codingStats, setCodingStats] = useState({ totalSolved: 0, streakDays: 1, xp: 0 });
  const [toastMessage, setToastMessage] = useState('');

  // Initial Load
  useEffect(() => {
    fetchDirectoryProblems();
    fetchDailyChallenge();
    fetchRoadmaps();
    if (user) {
      fetchUserCodingStats();
    }
  }, []);

  // Filter updates
  useEffect(() => {
    fetchDirectoryProblems();
  }, [selectedTopic, selectedDifficulty, selectedCompany, currentPage]);

  const fetchDirectoryProblems = async () => {
    try {
      setDirLoading(true);
      const res = await api.get('/coding/leetcode/problems', {
        params: {
          topic: selectedTopic !== 'All' ? selectedTopic : undefined,
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
          company: selectedCompany !== 'All' ? selectedCompany : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          limit: 15
        }
      });

      if (res.data.success) {
        setDirectoryProblems(res.data.problems || []);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.topicsList?.length > 0) setTopicsList(res.data.topicsList);
        if (res.data.companiesList?.length > 0) setCompaniesList(res.data.companiesList);

        // Update active problem if none
        if (!activeProblem && res.data.problems?.length > 0) {
          loadProblemIntoEditor(res.data.problems[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load LeetCode problems:', err);
    } finally {
      setDirLoading(false);
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      setDailyLoading(true);
      const res = await api.get('/coding/daily-challenge');
      if (res.data.success && res.data.challenge) {
        setDailyChallenge(res.data.challenge);
      }
    } catch (err) {
      console.error('Failed to load daily challenge:', err);
    } finally {
      setDailyLoading(false);
    }
  };

  const fetchRoadmaps = async () => {
    try {
      setRoadmapsLoading(true);
      const res = await api.get('/coding/roadmaps');
      if (res.data.success) {
        setRoadmaps(res.data.roadmaps || []);
      }
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setRoadmapsLoading(false);
    }
  };

  const fetchUserCodingStats = async () => {
    try {
      const res = await api.get('/coding/progress');
      if (res.data.success && res.data.stats) {
        setCodingStats(res.data.stats);
        if (res.data.stats.bookmarks) {
          setBookmarkedIds(new Set(res.data.stats.bookmarks.map(b => b.problemId?._id || b.problemId)));
        }
      }
    } catch (_) {}
  };

  const loadProblemIntoEditor = (problem) => {
    setActiveProblem(problem);
    setRunResult(null);
    setSubmissionResult(null);
    if (problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    } else {
      setCode(STARTER_CODES[language] || STARTER_CODES.javascript);
    }
    if (problem.sampleTestCases && problem.sampleTestCases.length > 0) {
      setCustomInput(problem.sampleTestCases[0].input || '');
    }
    setActiveTab('editor');
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (activeProblem?.starterCode?.[newLang]) {
      setCode(activeProblem.starterCode[newLang]);
    } else {
      setCode(STARTER_CODES[newLang] || '');
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    try {
      setRunning(true);
      setConsoleTab('output');
      setRunResult(null);

      const res = await api.post('/coding/run', {
        problemId: activeProblem?.id || activeProblem?._id,
        language,
        code,
        customInput
      });

      setRunResult(res.data);
    } catch (err) {
      setRunResult({
        success: false,
        status: 'Execution Error',
        message: err.response?.data?.message || 'Code execution failed.'
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    try {
      setSubmitting(true);
      setConsoleTab('output');
      setSubmissionResult(null);

      const res = await api.post('/coding/submit', {
        problemId: activeProblem?.id || activeProblem?._id,
        language,
        code
      });

      if (res.data.success) {
        setSubmissionResult(res.data.submission);
        if (res.data.submission.status === 'Accepted') {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          setSolvedIds(prev => new Set(prev).add(activeProblem?.id || activeProblem?._id));
          showToast('Accepted! +50 XP Awarded to your profile.');
          fetchUserCodingStats();
        }
      } else {
        setSubmissionResult(res.data);
      }
    } catch (err) {
      setSubmissionResult({
        status: 'Error',
        errorMessage: err.response?.data?.message || 'Submission failed.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBookmark = async (problem) => {
    const pId = problem.id || problem._id;
    if (!pId) return;

    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      return next;
    });

    if (!user) {
      showToast('Sign in to sync bookmarked coding problems');
      return;
    }

    try {
      const res = await api.post('/coding/bookmark', { problemId: pId });
      showToast(res.data.message || 'Bookmark updated');
      fetchUserCodingStats();
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleCompleteDailyChallenge = async () => {
    if (!dailyChallenge?.problem?._id) return;
    try {
      const res = await api.post('/coding/daily-challenge/complete', {
        problemId: dailyChallenge.problem._id
      });
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      showToast(res.data.message || 'Daily Challenge Recorded! +100 XP');
      fetchDailyChallenge();
      fetchUserCodingStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete challenge.');
    }
  };

  const handleGenerateAiProblem = async () => {
    try {
      setGeneratingAi(true);
      const res = await api.post('/coding/ai/generate', {
        topic: aiTopic,
        difficulty: aiDifficulty,
        targetCompany: aiCompany,
        language
      });

      if (res.data.success && res.data.problem) {
        setAiModalOpen(false);
        showToast('Original AI problem generated and added to explorer!');
        loadProblemIntoEditor(res.data.problem);
        fetchDirectoryProblems();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to generate AI problem.');
    } finally {
      setGeneratingAi(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const pId = activeProblem?.id || activeProblem?._id;
  const isBookmarked = bookmarkedIds.has(pId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 border border-electric-blue/20 dark:border-electric-blue/30 text-electric-blue dark:text-neon-cyan text-xs font-bold">
              <Code className="w-3.5 h-3.5" />
              <span>Verified LeetCode Problem Directory & Sandboxed Execution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              LeetCode Coding Practice & DSA Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore 60+ Blind 75 / NeetCode 150 problems with verified LeetCode links, company interview collections, daily coding challenges, sandboxed execution, and AI problem generation.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-center min-w-[95px]">
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{codingStats.totalSolved || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Solved</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-center min-w-[95px]">
              <div className="text-xl font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" /> {codingStats.streakDays || 1}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Day Streak</div>
            </div>
            <button
              onClick={() => setAiModalOpen(true)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-neon-purple to-electric-blue text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span>AI Problem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'directory'
              ? 'bg-electric-blue text-white shadow-glow-blue'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>LeetCode Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'editor'
              ? 'bg-electric-blue text-white shadow-glow-blue'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Code Editor {activeProblem ? `(${activeProblem.title})` : ''}</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'daily'
              ? 'bg-electric-blue text-white shadow-glow-blue'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Challenge</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmaps')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'roadmaps'
              ? 'bg-electric-blue text-white shadow-glow-blue'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>DSA Roadmaps (30/60/90 Days)</span>
        </button>
      </div>

      {/* TAB 1: LEETCODE PROBLEM DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDirectoryProblems()}
                placeholder="Search problem title, company..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue"
              />
            </div>

            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Topics ({topicsList.length})</option>
              {topicsList.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => { setSelectedCompany(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Companies</option>
              {companiesList.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Problem Cards Table */}
          {dirLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading verified LeetCode problem library...</p>
            </div>
          ) : directoryProblems.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400">
              No problems found matching this filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {directoryProblems.map((p) => {
                const diffColor =
                  p.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  p.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/20';

                const isPBookmarked = bookmarkedIds.has(p.id);

                return (
                  <div
                    key={p.id}
                    className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.leetcodeNumber && (
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{p.leetcodeNumber}
                          </span>
                        )}
                        <h3 className="text-sm font-extrabold text-white truncate hover:text-neon-cyan transition">
                          {p.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffColor}`}>
                          {p.difficulty}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-navy-900 text-slate-400 border border-slate-800">
                          {p.topic || p.category}
                        </span>
                        {p.source === 'ai_generated' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                            AI Generated
                          </span>
                        )}
                      </div>

                      {/* Company Badges */}
                      {p.companyTags && p.companyTags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[10px] text-slate-500 font-semibold">Asked in:</span>
                          {p.companyTags.map(comp => (
                            <span key={comp} className="text-[10px] font-bold text-slate-300 bg-navy-950 px-2 py-0.5 rounded-lg border border-slate-800">
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleBookmark(p)}
                        className={`p-2 rounded-xl border text-xs ${
                          isPBookmarked
                            ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40'
                            : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Bookmark problem"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {p.leetcodeUrl && (
                        <a
                          href={p.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
                          title="Open original LeetCode page"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>LeetCode</span>
                        </a>
                      )}

                      <button
                        onClick={() => loadProblemIntoEditor(p)}
                        className="px-4 py-1.5 rounded-xl bg-electric-blue text-white text-xs font-extrabold shadow-glow-blue hover:brightness-110 flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Solve Problem</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-400 font-bold px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROBLEM SOLVER & MONACO EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (5 cols): Problem Statement & Details */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 max-h-[780px] overflow-y-auto scrollbar-thin">
            {activeProblem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{activeProblem.leetcodeNumber || 'AI'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      activeProblem.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                      activeProblem.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                      'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}>
                      {activeProblem.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(activeProblem)}
                      className={`p-1.5 rounded-lg border text-xs ${
                        isBookmarked ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40' : 'bg-navy-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    {activeProblem.leetcodeUrl && (
                      <a
                        href={activeProblem.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 text-amber-400"
                        title="View on LeetCode"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-black text-white">{activeProblem.title}</h2>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-navy-900/50 p-4 rounded-2xl border border-slate-800">
                  {activeProblem.description}
                </div>

                {activeProblem.hindiDescription && (
                  <div className="text-xs text-slate-300 leading-relaxed bg-navy-900/30 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">हिन्दी विवरण:</span>
                    {activeProblem.hindiDescription}
                  </div>
                )}

                {/* Constraints */}
                {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Constraints:</h4>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 font-mono">
                      {activeProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Test Case */}
                {activeProblem.sampleTestCases && activeProblem.sampleTestCases.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Sample Test Case:</h4>
                    <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Input:</strong> {activeProblem.sampleTestCases[0].input}</div>
                      <div><strong className="text-slate-400">Output:</strong> {activeProblem.sampleTestCases[0].expectedOutput}</div>
                      {activeProblem.sampleTestCases[0].explanation && (
                        <div className="text-[11px] text-slate-500 mt-1">{activeProblem.sampleTestCases[0].explanation}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Complexity Specs */}
                <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Time: <strong className="text-white">{activeProblem.expectedTimeComplexity || 'O(N)'}</strong></span>
                  <span>Space: <strong className="text-white">{activeProblem.expectedSpaceComplexity || 'O(1)'}</strong></span>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-500">
                Select a problem from the LeetCode Explorer to read specifications.
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Monaco Code Editor & Execution Console */}
          <div className="lg:col-span-7 space-y-4">
            {/* Editor Top Bar */}
            <div className="glass-panel rounded-2xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs font-extrabold text-neon-cyan focus:outline-none cursor-pointer"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python 3</option>
                  <option value="java">Java (OpenJDK)</option>
                  <option value="cpp">C++ (GCC)</option>
                  <option value="c">C (GCC)</option>
                </select>

                <button
                  onClick={() => setCode(STARTER_CODES[language] || '')}
                  className="p-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
                  title="Reset code template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={running || submitting}
                  className="px-4 py-2 rounded-xl bg-navy-900 border border-electric-blue text-white text-xs font-bold hover:bg-navy-800 flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 text-neon-cyan" />}
                  <span>Run Code</span>
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={running || submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-electric-blue hover:brightness-110 text-white text-xs font-black shadow-glow-blue flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[420px] bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: 'Fira Code, Menlo, Monaco, monospace'
                }}
              />
            </div>

            {/* Bottom Console / Output Drawer */}
            <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                <button
                  onClick={() => setConsoleTab('testcases')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    consoleTab === 'testcases' ? 'bg-electric-blue text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Test Case Input
                </button>
                <button
                  onClick={() => setConsoleTab('output')}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    consoleTab === 'output' ? 'bg-electric-blue text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Execution Output
                </button>
              </div>

              {consoleTab === 'testcases' ? (
                <div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    rows={3}
                    placeholder="Enter test input..."
                    className="w-full p-3 rounded-xl bg-navy-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-electric-blue"
                  />
                </div>
              ) : (
                <div className="font-mono text-xs space-y-2">
                  {runResult ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          runResult.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {runResult.status || 'Finished'}
                        </span>
                        {runResult.executionTimeMs && <span className="text-slate-400">⏱️ {runResult.executionTimeMs} ms</span>}
                        {runResult.memoryKb && <span className="text-slate-400">💾 {runResult.memoryKb} KB</span>}
                      </div>

                      {runResult.stdout && (
                        <div className="p-2.5 rounded-lg bg-navy-950 text-slate-200">
                          <strong className="text-slate-400">stdout:</strong> {runResult.stdout}
                        </div>
                      )}

                      {runResult.stderr && (
                        <div className="p-2.5 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30">
                          <strong>stderr:</strong> {runResult.stderr}
                        </div>
                      )}

                      {runResult.message && (
                        <div className="text-xs text-slate-400">
                          {runResult.message}
                        </div>
                      )}
                    </div>
                  ) : submissionResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          submissionResult.status === 'Accepted' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {submissionResult.status}
                        </span>
                        {submissionResult.testCasesPassed !== undefined && (
                          <span className="text-slate-300 font-bold">
                            Passed {submissionResult.testCasesPassed} / {submissionResult.totalTestCases} test cases
                          </span>
                        )}
                      </div>
                      {submissionResult.errorMessage && (
                        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300">
                          {submissionResult.errorMessage}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 py-2">
                      Click "Run Code" or "Submit Solution" to inspect execution results.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: DAILY CODING CHALLENGE */}
      {activeTab === 'daily' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {dailyLoading ? (
            <div className="py-20 text-center text-xs text-slate-400">Loading today's challenge...</div>
          ) : dailyChallenge?.problem ? (
            <div className="glass-panel rounded-3xl p-8 border border-amber-500/30 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date: {dailyChallenge.dateString}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  dailyChallenge.userStatus === 'solved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  dailyChallenge.userStatus === 'attempted' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  Status: {dailyChallenge.userStatus.toUpperCase()}
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{dailyChallenge.problem.leetcodeNumber || 'Daily'}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  {dailyChallenge.problem.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {dailyChallenge.problem.difficulty}
                  </span>
                  <span className="text-xs text-slate-400">
                    Topic: {dailyChallenge.problem.topic || dailyChallenge.problem.category}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {dailyChallenge.problem.description}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => loadProblemIntoEditor(dailyChallenge.problem)}
                  className="px-6 py-3 rounded-xl bg-electric-blue text-white text-xs font-extrabold shadow-glow-blue hover:brightness-110 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Solve in AspirantAI Editor</span>
                </button>

                {dailyChallenge.problem.leetcodeUrl && (
                  <a
                    href={dailyChallenge.problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-400" />
                    <span>Open on LeetCode</span>
                  </a>
                )}

                <button
                  onClick={handleCompleteDailyChallenge}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Challenge Completed (+100 XP)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400">
              Daily challenge is currently being scheduled.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DSA ROADMAPS */}
      {activeTab === 'roadmaps' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapsLoading ? (
            <div className="col-span-3 py-20 text-center text-xs text-slate-400">Loading DSA roadmaps...</div>
          ) : (
            roadmaps.map((r) => (
              <div key={r.id} className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-electric-blue/15 text-neon-cyan border border-electric-blue/30 text-[10px] font-extrabold">
                      {r.durationDays} Days Plan
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {r.completionPercentage}% Done
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">{r.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-electric-blue to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${r.completionPercentage}%` }}
                    />
                  </div>

                  {/* Phases */}
                  <div className="space-y-2 pt-2">
                    {r.phases.map((ph, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-navy-900/60 border border-slate-800/80 text-xs">
                        <div className="font-bold text-white text-[11px] mb-1">
                          Week {ph.week}: {ph.theme}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ph.slugs.map(slug => (
                            <span key={slug} className="text-[9px] font-mono text-slate-400 bg-navy-950 px-1.5 py-0.5 rounded border border-slate-800">
                              {slug}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedTopic('All'); setActiveTab('directory'); }}
                  className="w-full py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold text-center"
                >
                  Browse Practice Problems
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* AI PROBLEM GENERATION MODAL */}
      <AnimatePresence>
        {aiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full glass-panel rounded-3xl p-6 sm:p-8 border border-neon-purple/40 space-y-5 bg-navy-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-purple" />
                  <h3 className="text-lg font-black text-white">AI Problem Generator</h3>
                </div>
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Generate an original, Tier-1 interview coding problem using Gemini/OpenAI models.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">DSA Topic</label>
                  <select
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Arrays">Arrays & Two Pointers</option>
                    <option value="Strings">Strings & Sliding Window</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Stacks & Queues">Stacks & Queues</option>
                    <option value="Trees & BST">Trees & Binary Search Trees</option>
                    <option value="Graphs">Graphs (BFS/DFS)</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Backtracking">Recursion & Backtracking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Easy">Easy (Foundation)</option>
                    <option value="Medium">Medium (Standard MNC)</option>
                    <option value="Hard">Hard (FAANG / Competitive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Company Pattern</label>
                  <select
                    value={aiCompany}
                    onChange={(e) => setAiCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="Google">Google Standard</option>
                    <option value="Amazon">Amazon Standard</option>
                    <option value="Meta">Meta Standard</option>
                    <option value="Microsoft">Microsoft Standard</option>
                    <option value="Apple">Apple Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl glass-panel text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAiProblem}
                  disabled={generatingAi}
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-electric-blue text-white text-xs font-black shadow-glow-blue hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />}
                  <span>{generatingAi ? 'Generating...' : 'Generate Now'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
