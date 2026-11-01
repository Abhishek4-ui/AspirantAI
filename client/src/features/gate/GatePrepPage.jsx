import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Award, BookOpen, CheckCircle, Clock, FileText, ChevronDown, ChevronRight,
  TrendingUp, Sparkles, Filter, ExternalLink, Search, CheckCircle2,
  AlertTriangle, RotateCcw, Play, Layers, Compass, Brain, Calculator, Target,
  Bookmark, Flag, Check, X, Shield, RefreshCw, Hash, HelpCircle
} from 'lucide-react';

export default function GatePrepPage() {
  const { user } = useAuth();

  // Selected Paper State
  const [papers, setPapers] = useState([]);
  const [selectedPaperCode, setSelectedPaperCode] = useState(() => {
    return localStorage.getItem('aspirantai_gate_paper') || 'CS';
  });
  const [selectedYear, setSelectedYear] = useState('2026');
  const [paperSearch, setPaperSearch] = useState('');
  const [paperDetails, setPaperDetails] = useState(null);

  // Active Tab: 'syllabus' | 'pyqs' | 'cbt' | 'practice' | 'analytics' | 'formulas' | 'bookmarks'
  const [activeTab, setActiveTab] = useState('syllabus');
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(0);

  // Tracker State
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [readinessScore, setReadinessScore] = useState(0);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());

  // PYQs State & Filters
  const [pyqs, setPyqs] = useState([]);
  const [pyqLoading, setPyqLoading] = useState(false);
  const [pyqYearFilter, setPyqYearFilter] = useState('All');
  const [pyqTypeFilter, setPyqTypeFilter] = useState('All');
  const [pyqSubjectFilter, setPyqSubjectFilter] = useState('All');
  const [pyqDifficultyFilter, setPyqDifficultyFilter] = useState('All');
  const [expandedPyq, setExpandedPyq] = useState(null);
  const [pyqUserAnswers, setPyqUserAnswers] = useState({});

  // Reporting State
  const [reportModalQuestion, setReportModalQuestion] = useState(null);
  const [reportReason, setReportReason] = useState('Incorrect Answer Key');
  const [reportNote, setReportNote] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  // AI Practice State
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceFormat, setPracticeFormat] = useState('mixed');
  const [practiceSubject, setPracticeSubject] = useState('');
  const [practiceDifficulty, setPracticeDifficulty] = useState('medium');
  const [practiceSelectedAnswers, setPracticeSelectedAnswers] = useState({});
  const [practiceShowSolutions, setPracticeShowSolutions] = useState({});

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);

  // 1. Fetch available GATE papers list on mount & year change
  useEffect(() => {
    fetchPapers();
  }, [selectedYear]);

  // 2. Fetch paper details, tracker, pyqs when selectedPaperCode changes
  useEffect(() => {
    if (selectedPaperCode) {
      localStorage.setItem('aspirantai_gate_paper', selectedPaperCode);
      fetchPaperDetails(selectedPaperCode);
      fetchTracker(selectedPaperCode);
      fetchPyqs(selectedPaperCode);
      fetchAnalytics(selectedPaperCode);
    }
  }, [selectedPaperCode]);

  // Refetch PYQs whenever filter changes
  useEffect(() => {
    if (selectedPaperCode && activeTab === 'pyqs') {
      fetchPyqs(selectedPaperCode);
    }
  }, [pyqYearFilter, pyqTypeFilter, pyqSubjectFilter, pyqDifficultyFilter]);

  const fetchPapers = async () => {
    try {
      const res = await api.get('/gate/papers', { params: { year: selectedYear } });
      if (res.data.success) {
        setPapers(res.data.papers);
      }
    } catch (err) {
      console.error('Failed to load GATE papers list:', err);
    }
  };

  const fetchPaperDetails = async (code) => {
    try {
      setLoading(true);
      const res = await api.get(`/gate/papers/${code}`);
      if (res.data.success) {
        setPaperDetails(res.data.paper);
        if (res.data.paper.sections && res.data.paper.sections.length > 0) {
          setPracticeSubject(res.data.paper.sections[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to load paper details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracker = async (code) => {
    try {
      const res = await api.get(`/gate/papers/${code}/tracker`);
      if (res.data.success) {
        setCompletedTopics(new Set(res.data.completedTopics || []));
        setBookmarkedIds(new Set(res.data.bookmarkedQuestionIds || []));
        setCompletedQuestionIds(new Set(res.data.completedQuestionIds || []));
        setCompletionPercentage(res.data.completionPercentage || 0);
        setReadinessScore(res.data.readinessScore || 0);
      }
    } catch (err) {
      console.error('Failed to load tracker progress:', err);
    }
  };

  const fetchPyqs = async (code) => {
    try {
      setPyqLoading(true);
      const res = await api.get(`/gate/papers/${code}/pyqs`, {
        params: {
          year: pyqYearFilter !== 'All' ? pyqYearFilter : undefined,
          questionType: pyqTypeFilter !== 'All' ? pyqTypeFilter : undefined,
          subject: pyqSubjectFilter !== 'All' ? pyqSubjectFilter : undefined,
          difficulty: pyqDifficultyFilter !== 'All' ? pyqDifficultyFilter : undefined
        }
      });
      if (res.data.success) {
        setPyqs(res.data.pyqs || []);
      }
    } catch (err) {
      console.error('Failed to load PYQs:', err);
    } finally {
      setPyqLoading(false);
    }
  };

  const fetchAnalytics = async (code) => {
    try {
      const res = await api.get(`/gate/papers/${code}/analytics`);
      if (res.data.success) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const toggleTopicCompletion = async (topicName) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicName)) next.delete(topicName);
      else next.add(topicName);
      return next;
    });

    try {
      const res = await api.post(`/gate/papers/${selectedPaperCode}/tracker`, { topicName });
      if (res.data.success) {
        setCompletedTopics(new Set(res.data.completedTopics || []));
        setCompletionPercentage(res.data.completionPercentage || 0);
        setReadinessScore(res.data.readinessScore || 0);
      }
    } catch (err) {
      fetchTracker(selectedPaperCode);
    }
  };

  const handleToggleBookmark = async (questionId) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });

    try {
      await api.post(`/gate/questions/${questionId}/bookmark`);
    } catch (err) {
      fetchTracker(selectedPaperCode);
    }
  };

  const handleToggleComplete = async (questionId) => {
    setCompletedQuestionIds(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });

    try {
      await api.post(`/gate/questions/${questionId}/complete`);
    } catch (err) {
      fetchTracker(selectedPaperCode);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportModalQuestion) return;
    try {
      const res = await api.post(`/gate/questions/${reportModalQuestion.id}/report`, {
        reason: reportReason,
        userNote: reportNote
      });
      if (res.data.success) {
        setReportSuccessMsg('Report submitted successfully. Thank you for maintaining accuracy!');
        setTimeout(() => {
          setReportSuccessMsg('');
          setReportModalQuestion(null);
          setReportNote('');
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit question report:', err);
    }
  };

  const handleSeedPyqs = async () => {
    try {
      setPyqLoading(true);
      await api.post(`/gate/papers/${selectedPaperCode}/pyqs/seed`);
      await fetchPyqs(selectedPaperCode);
    } catch (err) {
      console.error('Failed to seed PYQs:', err);
    } finally {
      setPyqLoading(false);
    }
  };

  const handleGeneratePractice = async () => {
    try {
      setPracticeLoading(true);
      const res = await api.post(`/gate/papers/${selectedPaperCode}/generate-questions`, {
        count: 5,
        subject: practiceSubject || undefined,
        questionType: practiceFormat,
        difficulty: practiceDifficulty
      });
      if (res.data.success) {
        setPracticeQuestions(res.data.questions || []);
        setPracticeSelectedAnswers({});
        setPracticeShowSolutions({});
      }
    } catch (err) {
      console.error('Failed to generate practice:', err);
    } finally {
      setPracticeLoading(false);
    }
  };

  // Filter papers by search term
  const filteredPapers = papers.filter(p =>
    p.code.toLowerCase().includes(paperSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(paperSearch.toLowerCase())
  );

  const allTopicsCount = paperDetails?.sections?.reduce((acc, s) => acc + s.topics.length, 0) || 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/60 via-purple-900/40 to-navy-950 p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <Award className="w-4 h-4 text-neon-cyan" />
              Official GATE 30-Discipline Comprehensive Portal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              GATE {paperDetails?.name || 'Preparation Portal'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Official syllabus blueprint for all 30 engineering & science disciplines. Track syllabus completion, solve verified official PYQs, practice branch-specific NAT/MSQ questions, and launch realistic 65-question computer-based tests.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-neon-cyan font-mono text-xs font-bold">
                Paper Code: [{selectedPaperCode}]
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs">
                65 Questions • 100 Marks • 180 Mins
              </span>
              {paperDetails?.hasEngineeringMath && (
                <span className="px-3 py-1 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  Engineering Math (~13 Marks)
                </span>
              )}
              <span className="px-3 py-1 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                General Aptitude (15 Marks)
              </span>
            </div>
          </div>
        </div>

        {/* Paper Selector & Year Filter Bar */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Select Discipline:
              </span>
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 30 papers (e.g. CS, DA, ME, EC)..."
                  value={paperSearch}
                  onChange={(e) => setPaperSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-400">Exam Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="2026">GATE 2026</option>
                  <option value="2025">GATE 2025</option>
                  <option value="2024">GATE 2024</option>
                  <option value="2023">GATE 2023</option>
                  <option value="2022">GATE 2022</option>
                </select>
              </div>

              <Link
                to={`/cbt?examCode=GATE_${selectedPaperCode}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Launch 65-Q CBT
              </Link>
            </div>
          </div>

          {/* Quick Paper Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredPapers.map(p => (
              <button
                key={p.code}
                onClick={() => setSelectedPaperCode(p.code)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedPaperCode === p.code
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="font-mono text-neon-cyan">[{p.code}]</span>
                <span>{p.name.length > 26 ? p.name.slice(0, 24) + '...' : p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'syllabus', label: 'Syllabus Tracker', icon: BookOpen },
            { id: 'pyqs', label: 'Official PYQs', icon: FileText },
            { id: 'cbt', label: 'CBT Simulator', icon: Play },
            { id: 'practice', label: 'AI Practice (MCQ/MSQ/NAT)', icon: Brain },
            { id: 'analytics', label: 'Readiness & Analytics', icon: TrendingUp },
            { id: 'formulas', label: 'Formulas & Cheat-Sheets', icon: Calculator }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm whitespace-nowrap transition border-b-2 -mb-[2px] ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SYLLABUS TRACKER */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 w-full md:w-2/3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Syllabus Completion</span>
                  <span className="font-mono font-bold text-neon-cyan text-sm">{completionPercentage}% Completed</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-neon-cyan transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {completedTopics.size} of {allTopicsCount} core topics marked complete across {paperDetails?.sections?.length || 0} syllabus sections.
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-48">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Readiness</span>
                <span className="text-2xl font-black text-white">{readinessScore}/100</span>
                <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
                  {readinessScore >= 70 ? 'High Readiness' : readinessScore >= 40 ? 'Moderate Prep' : 'Beginner Phase'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {paperDetails?.sections?.map((section, sIdx) => {
                const isExpanded = expandedSection === sIdx;
                const sectionCompleted = section.topics.filter(t => completedTopics.has(t)).length;
                const sectionPercentage = Math.round((sectionCompleted / (section.topics.length || 1)) * 100);

                return (
                  <div key={section.name} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? -1 : sIdx)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-white">{section.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-blue-300">
                            ~{Math.round(section.weight * 100)}% Weight
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {sectionCompleted} of {section.topics.length} topics completed ({sectionPercentage}%)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 hidden sm:block overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${sectionPercentage}%` }} />
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-800/60 divide-y divide-slate-800/40">
                        {section.topics.map((topic) => {
                          const isDone = completedTopics.has(topic);
                          return (
                            <div key={topic} className="py-3 flex items-center justify-between gap-4">
                              <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleTopicCompletion(topic)}
                                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900"
                                />
                                <span className={`text-xs sm:text-sm ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                  {topic}
                                </span>
                              </label>

                              <Link
                                to={`/learning-library?search=${encodeURIComponent(`GATE ${selectedPaperCode} ${topic}`)}`}
                                className="text-[11px] text-neon-cyan hover:underline flex items-center gap-1 font-semibold whitespace-nowrap"
                              >
                                Watch Lessons <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL PYQS */}
        {activeTab === 'pyqs' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neon-cyan" />
                    Verified Official GATE {selectedPaperCode} Previous Year Questions
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authentic questions from official GATE papers with verified step-by-step conceptual solutions and strict marking rules.
                  </p>
                </div>

                <button
                  onClick={handleSeedPyqs}
                  disabled={pyqLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                  title="Refresh or seed official question bank"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pyqLoading ? 'animate-spin' : ''}`} />
                  Sync Question Bank
                </button>
              </div>

              {/* Multi-Filter Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                {/* Year Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Exam Year</label>
                  <select
                    value={pyqYearFilter}
                    onChange={(e) => setPyqYearFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="All">All Years</option>
                    <option value="2024">GATE 2024</option>
                    <option value="2023">GATE 2023</option>
                    <option value="2022">GATE 2022</option>
                    <option value="2021">GATE 2021</option>
                    <option value="2020">GATE 2020</option>
                  </select>
                </div>

                {/* Question Type Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Question Type</label>
                  <select
                    value={pyqTypeFilter}
                    onChange={(e) => setPyqTypeFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="single_choice">MCQ (Single Choice)</option>
                    <option value="multiple_choice">MSQ (Multiple Select)</option>
                    <option value="numerical">NAT (Numerical Answer)</option>
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Syllabus Section</label>
                  <select
                    value={pyqSubjectFilter}
                    onChange={(e) => setPyqSubjectFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="All">All Sections</option>
                    {paperDetails?.sections?.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Difficulty</label>
                  <select
                    value={pyqDifficultyFilter}
                    onChange={(e) => setPyqDifficultyFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions List */}
            {pyqLoading ? (
              <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
                <RefreshCw className="w-8 h-8 mx-auto text-blue-400 animate-spin" />
                <p className="text-xs text-slate-400">Loading verified official GATE questions...</p>
              </div>
            ) : pyqs.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-slate-500" />
                <h3 className="text-sm font-bold text-slate-300">No Verified Questions Found for this Filter</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Official GATE questions are indexed strictly without cross-branch contamination. You can generate practice questions or seed the verified archive.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSeedPyqs}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Seed Verified PYQs
                  </button>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Generate AI Practice Questions
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {pyqs.map((q, idx) => {
                  const isOpen = expandedPyq === q.id;
                  const isBookmarked = bookmarkedIds.has(q.id);
                  const isCompleted = completedQuestionIds.has(q.id);
                  const isNAT = q.questionType === 'numerical';
                  const isMSQ = q.questionType === 'multiple_choice';

                  return (
                    <div key={q.id || idx} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                      {/* Card Top Badges & Actions */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-900/50 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                            GATE {q.examinationYear} • {q.marks} Mark{q.marks > 1 ? 's' : ''}
                          </span>
                          
                          {isMSQ && (
                            <span className="px-2 py-0.5 rounded-lg bg-purple-900/50 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                              MSQ • Multiple Correct (0 Negative)
                            </span>
                          )}
                          {isNAT && (
                            <span className="px-2 py-0.5 rounded-lg bg-amber-900/50 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                              NAT • Numerical Answer (0 Negative)
                            </span>
                          )}
                          {!isMSQ && !isNAT && (
                            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold">
                              MCQ • Single Choice (-{q.negativeMarks})
                            </span>
                          )}

                          <span className="text-xs font-semibold text-slate-400">
                            {q.subject} {q.topic ? `› ${q.topic}` : ''}
                          </span>
                        </div>

                        {/* Top-Right Question Actions: Bookmark, Complete, Report */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleToggleBookmark(q.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              isBookmarked
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleToggleComplete(q.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              isCompleted
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={isCompleted ? 'Marked as Completed' : 'Mark Completed'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setReportModalQuestion(q)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition"
                            title="Report Error / Discrepancy"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-medium text-white leading-relaxed">{q.questionText}</p>

                      {/* Options for MCQ / MSQ */}
                      {!isNAT && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map((opt) => {
                            const isCorrectChoice = isMSQ
                              ? (q.multipleCorrectAnswers || []).includes(opt.key)
                              : opt.key === q.correctAnswer;

                            return (
                              <div
                                key={opt.key}
                                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
                                  isOpen && isCorrectChoice
                                    ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 font-bold'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-lg text-center leading-6 font-mono font-bold text-xs ${
                                  isOpen && isCorrectChoice
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* NAT Answer Input Field Indicator */}
                      {isNAT && (
                        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-mono">
                            Numerical Answer Type (NAT) • Enter exact decimal/integer value
                          </span>
                          <span className="text-[11px] text-amber-400 font-semibold">
                            Tolerance: ±{q.numericalTolerance}
                          </span>
                        </div>
                      )}

                      {/* Card Bottom Bar */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedPyq(isOpen ? null : q.id)}
                          className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          {isOpen ? 'Hide Detailed Solution' : 'View Verified Solution & Answer Key'}
                        </button>
                        {q.officialSourceUrl && (
                          <a
                            href={q.officialSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono"
                          >
                            Official Source <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      {/* Solution Dropdown */}
                      {isOpen && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            {isNAT ? (
                              <span>Correct Numerical Answer: <strong>{q.correctAnswer}</strong> (Acceptable Range: {parseFloat(q.correctAnswer) - q.numericalTolerance} to {parseFloat(q.correctAnswer) + q.numericalTolerance})</span>
                            ) : isMSQ ? (
                              <span>Correct Option(s): <strong>{q.multipleCorrectAnswers?.join(', ') || q.correctAnswer}</strong></span>
                            ) : (
                              <span>Correct Answer: Option <strong>{q.correctAnswer}</strong></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CBT SIMULATOR */}
        {activeTab === 'cbt' && (
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-glow-blue">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Realistic GATE {selectedPaperCode} CBT Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Strict 180-minute countdown, official 65 questions (10 General Aptitude + 55 Core Subject), section switching, answer persistence, and virtual calculator compatibility.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                <span className="text-base font-bold text-white font-mono">180 Mins</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Questions</span>
                <span className="text-base font-bold text-white font-mono">65 Qs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Max Marks</span>
                <span className="text-base font-bold text-white font-mono">100 Marks</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/cbt?examCode=GATE_${selectedPaperCode}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-electric-blue hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Full-Length Simulation Test
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: AI PRACTICE (MCQ, MSQ, NAT) */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-neon-cyan" />
                    Dynamic AI Practice Generator
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate instant syllabus-aligned multiple choice, multiple select, and numerical answer practice questions for GATE [{selectedPaperCode}].
                  </p>
                </div>

                <button
                  onClick={handleGeneratePractice}
                  disabled={practiceLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {practiceLoading ? 'Generating Questions...' : 'Generate 5 Practice Questions'}
                </button>
              </div>

              {/* Generator Configuration Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Question Format</label>
                  <select
                    value={practiceFormat}
                    onChange={(e) => setPracticeFormat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="mixed">Mixed (MCQ + MSQ + NAT)</option>
                    <option value="single_choice">MCQ Only (Single Choice)</option>
                    <option value="multiple_choice">MSQ Only (Multiple Select)</option>
                    <option value="numerical">NAT Only (Numerical Answer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Syllabus Section</label>
                  <select
                    value={practiceSubject}
                    onChange={(e) => setPracticeSubject(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    {paperDetails?.sections?.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Difficulty Level</label>
                  <select
                    value={practiceDifficulty}
                    onChange={(e) => setPracticeDifficulty(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard GATE)</option>
                    <option value="hard">Hard (Advanced Multi-Concept)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Render Practice Questions */}
            {practiceQuestions.length > 0 ? (
              <div className="space-y-4">
                {practiceQuestions.map((q, qIdx) => {
                  const selectedVal = practiceSelectedAnswers[qIdx];
                  const showSol = practiceShowSolutions[qIdx];
                  const isNAT = q.questionType === 'numerical';
                  const isMSQ = q.questionType === 'multiple_choice';

                  return (
                    <div key={q.questionText || qIdx} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">
                            Practice Question {qIdx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 text-[10px] font-bold">
                            {isNAT ? 'NAT' : isMSQ ? 'MSQ' : 'MCQ'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{q.subject}</span>
                      </div>

                      <p className="text-sm font-semibold text-white">{q.questionText}</p>

                      {/* MCQ / MSQ Options */}
                      {!isNAT && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map(opt => {
                            const isSelected = isMSQ
                              ? (Array.isArray(selectedVal) && selectedVal.includes(opt.key))
                              : selectedVal === opt.key;

                            const isCorrectChoice = isMSQ
                              ? (q.multipleCorrectAnswers || []).includes(opt.key)
                              : opt.key === q.correctAnswer;

                            return (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  if (isMSQ) {
                                    setPracticeSelectedAnswers(prev => {
                                      const current = Array.isArray(prev[qIdx]) ? [...prev[qIdx]] : [];
                                      const idx = current.indexOf(opt.key);
                                      if (idx > -1) current.splice(idx, 1);
                                      else current.push(opt.key);
                                      return { ...prev, [qIdx]: current };
                                    });
                                  } else {
                                    setPracticeSelectedAnswers(prev => ({ ...prev, [qIdx]: opt.key }));
                                  }
                                }}
                                className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 transition ${
                                  showSol && isCorrectChoice
                                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                                    : showSol && isSelected && !isCorrectChoice
                                    ? 'bg-red-950/80 border-red-500 text-red-300'
                                    : isSelected
                                    ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-lg text-center leading-6 font-mono font-bold text-xs ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* NAT Answer Field */}
                      {isNAT && (
                        <div className="pt-2 flex items-center gap-3">
                          <input
                            type="number"
                            step="any"
                            placeholder="Enter numerical answer..."
                            value={selectedVal || ''}
                            onChange={(e) => setPracticeSelectedAnswers(prev => ({ ...prev, [qIdx]: e.target.value }))}
                            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
                          />
                          <span className="text-xs text-slate-400 font-mono">
                            Tolerance: ±{q.numericalTolerance || 0.01}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <button
                          onClick={() => setPracticeShowSolutions(prev => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                          className="text-xs font-bold text-neon-cyan hover:underline"
                        >
                          {showSol ? 'Hide Explanation' : 'Check Answer & Explanation'}
                        </button>
                      </div>

                      {showSol && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Correct Answer: {isNAT ? q.correctAnswer : isMSQ ? (q.multipleCorrectAnswers?.join(', ') || q.correctAnswer) : `Option ${q.correctAnswer}`}
                          </div>
                          <p className="text-slate-300 mt-1 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
                <Brain className="w-10 h-10 mx-auto text-slate-500" />
                <h3 className="text-sm font-bold text-slate-300">Ready to Practice</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button above to generate personalized practice questions tailored to GATE {selectedPaperCode}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: READINESS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Readiness</span>
                <div className="text-4xl font-black text-neon-cyan font-mono">{readinessScore}%</div>
                <p className="text-xs text-slate-400">
                  Calculated from syllabus completion, mock test attempts, and topic accuracy.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estimated Rank Tier</span>
                <div className="text-4xl font-black text-purple-400 font-mono">
                  {readinessScore >= 80 ? 'Top 500' : readinessScore >= 60 ? 'Top 2500' : 'Qualifying'}
                </div>
                <p className="text-xs text-slate-400">
                  Based on historical qualifying marks and percentile distributions.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recommended Daily Focus</span>
                <div className="text-base font-bold text-emerald-400">Engineering Math & GA</div>
                <p className="text-xs text-slate-400">
                  28 compulsory marks that significantly dictate All-India GATE rankings.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Syllabus Section Weightage & Projected Mastery</h3>
              <div className="space-y-3">
                {paperDetails?.sections?.map(s => (
                  <div key={s.name} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{s.name}</span>
                      <span className="text-[10px] text-slate-400">{s.topics.length} topics covered</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-neon-cyan font-mono text-xs font-bold">
                      ~{Math.round(s.weight * 100)}% Weight
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FORMULAS & CHEAT-SHEETS */}
        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h2 className="text-base font-bold text-white">High-Yield GATE Formula Cards</h2>
              <p className="text-xs text-slate-400 mt-1">
                Standard reference equations and mathematical identities for rapid revision before examination day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Master's Theorem", formula: "T(n) = aT(n/b) + Θ(n^k log^p n)", detail: "Case 1: a > b^k → Θ(n^(log_b a)). Case 2: a = b^k and p > -1 → Θ(n^k log^(p+1) n)." },
                { name: "Bayes' Theorem", formula: "P(A|B) = [P(B|A) * P(A)] / P(B)", detail: "Fundamental for Naive Bayes classification and statistical inference." },
                { name: "Graph Handshaking Lemma", formula: "∑ deg(v) = 2|E|", detail: "Number of vertices of odd degree in any undirected graph is always even." },
                { name: "Pipelining Speedup", formula: "S = (k * n) / (k + n - 1)", detail: "Under ideal pipeline conditions with n tasks and k stages, Speedup approaches k." },
                { name: "Eigenvalues Invariants", formula: "∑ λ_i = Trace(A), ∏ λ_i = det(A)", detail: "Matrix is strictly invertible if and only if all eigenvalues λ_i ≠ 0." },
                { name: "Bernoulli's Equation", formula: "P + 1/2 ρv^2 + ρgh = Constant", detail: "Conservation of energy along a streamline for steady incompressible flow." }
              ].map(card => (
                <div key={card.name} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-neon-cyan block">{card.name}</span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {card.formula}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Question Error Reporting Modal */}
      {reportModalQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-950 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" /> Report Question Issue
              </h3>
              <button
                onClick={() => setReportModalQuestion(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">
              "{reportModalQuestion.questionText}"
            </p>

            {reportSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center">
                {reportSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Issue Type</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Incorrect Answer Key">Incorrect Answer Key</option>
                    <option value="Ambiguous Question Text">Ambiguous Question Text</option>
                    <option value="Numerical Tolerance Discrepancy">Numerical Tolerance Discrepancy</option>
                    <option value="Syllabus Mismatch">Syllabus Mismatch</option>
                    <option value="Formatting or Typo">Formatting or Typo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Additional Details (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the discrepancy..."
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalQuestion(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
