import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MASTER_EXAM_CATALOG } from '../../constants/examCatalog';
import {
  Clock, Shield, Award, CheckCircle2, AlertTriangle, ArrowRight,
  ArrowLeft, Bookmark, RotateCcw, Send, HelpCircle, Layers,
  ChevronDown, Maximize2, Minimize2, Check, X, FileText, Sparkles
} from 'lucide-react';

const CBT_EXAMS = MASTER_EXAM_CATALOG;

export default function CbtSimulatorPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examCode, setExamCode] = useState(searchParams.get('examCode') || 'UPSC_CSE');
  const [language, setLanguage] = useState(searchParams.get('lang') || 'en');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [cbtTest, setCbtTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // CBT State
  const [answers, setAnswers] = useState({}); // { [questionIndex/id]: optionKey }
  const [markedForReview, setMarkedForReview] = useState(new Set()); // Set of question indexes
  const [visited, setVisited] = useState(new Set([1])); // Set of question indexes
  const [timeLeft, setTimeLeft] = useState(3600); // seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState('');

  const timerRef = useRef(null);

  // Sync state if URL search params change
  useEffect(() => {
    const qExam = searchParams.get('examCode');
    const qLang = searchParams.get('lang');
    if (qExam && qExam !== examCode) setExamCode(qExam);
    if (qLang && qLang !== language) setLanguage(qLang);
  }, [searchParams]);

  useEffect(() => {
    fetchCbtTest();
  }, [id, examCode, language]);

  const fetchCbtTest = async (force = false) => {
    try {
      setLoading(true);
      setLoadError('');
      setResult(null);

      let endpoint = '';
      let params = {};

      if (id) {
        endpoint = `/mock-tests/${id}`;
      } else {
        endpoint = '/mock-tests/daily-cbt';
        params = { examCode, language, ...(force ? { force: 'true' } : {}) };
      }

      const res = await api.get(endpoint, { params });

      if (res.data.success) {
        const test = res.data.cbtTest || res.data.mockTest;
        if (test) {
          test.id = test.id || test._id;
          setCbtTest(test);
          setQuestions(test.questions || []);

          if (res.data.completedAttempt) {
            setResult(res.data.completedAttempt);
          } else if (res.data.activeAttempt) {
            const act = res.data.activeAttempt;
            setAnswers(act.answers || {});
            setMarkedForReview(new Set(act.markedForReview || []));
            setVisited(new Set(act.visitedQuestions || [1]));
            setTimeLeft(act.timeLeftSeconds || (test.totalDurationSeconds || (test.durationMinutes * 60)));
            setCurrentIndex(act.currentIndex || 0);
          } else {
            setAnswers({});
            setMarkedForReview(new Set());
            setVisited(new Set([1]));
            setTimeLeft(test.totalDurationSeconds || ((test.durationMinutes || 60) * 60));
            setCurrentIndex(0);
          }
        } else {
          setLoadError('Examination paper not found for this category.');
        }
      } else {
        setLoadError(res.data.message || 'Unable to retrieve CBT examination.');
      }
    } catch (err) {
      console.error('Failed to load CBT examination:', err);
      setLoadError(err.response?.data?.message || err.message || 'Failed to connect to CBT examination server.');
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!cbtTest || result || timeLeft <= 0 || loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [cbtTest, result, timeLeft, loading]);

  // Real-time CBT attempt progress persistence
  const persistCbtProgress = async (newAnswers, newMarked, newVisited, newIndex, newTime) => {
    if (!cbtTest || result || id || !user) return;
    try {
      await api.put('/mock-tests/cbt/progress', {
        testId: cbtTest.id || cbtTest._id,
        answers: newAnswers !== undefined ? newAnswers : answers,
        markedForReview: Array.from(newMarked !== undefined ? newMarked : markedForReview),
        visitedQuestions: Array.from(newVisited !== undefined ? newVisited : visited),
        timeLeftSeconds: newTime !== undefined ? newTime : timeLeft,
        currentIndex: newIndex !== undefined ? newIndex : currentIndex
      });
      setSaveIndicator('Synced');
      setTimeout(() => setSaveIndicator(''), 1500);
    } catch (err) {
      // Quiet fail for offline
    }
  };

  const handleSelectOption = (qKey, optionKey, isMSQ = false) => {
    if (isMSQ) {
      const current = Array.isArray(answers[qKey]) ? [...answers[qKey]] : (answers[qKey] ? [answers[qKey]] : []);
      const idx = current.indexOf(optionKey);
      if (idx > -1) current.splice(idx, 1);
      else current.push(optionKey);
      const nextAnswers = {
        ...answers,
        [qKey]: current
      };
      setAnswers(nextAnswers);
    } else {
      const nextAnswers = {
        ...answers,
        [qKey]: optionKey
      };
      setAnswers(nextAnswers);
    }
  };

  const handleInputNumerical = (qKey, val) => {
    const nextAnswers = {
      ...answers,
      [qKey]: val
    };
    setAnswers(nextAnswers);
  };

  // Save & Next Button
  const handleSaveAndNext = () => {
    const nextVisited = new Set(visited).add(currentIndex + 2);
    setVisited(nextVisited);

    const nextIndex = Math.min(currentIndex + 1, questions.length - 1);
    setCurrentIndex(nextIndex);

    persistCbtProgress(answers, markedForReview, nextVisited, nextIndex, timeLeft);
  };

  // Clear Response Button
  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    const qKey = currentQ?.index || (currentIndex + 1);

    const nextAnswers = { ...answers };
    delete nextAnswers[qKey];
    delete nextAnswers[currentQ?.id];
    setAnswers(nextAnswers);

    persistCbtProgress(nextAnswers, markedForReview, visited, currentIndex, timeLeft);
  };

  // Mark for Review & Next Button
  const handleMarkForReviewAndNext = () => {
    const currentQIndex = (questions[currentIndex]?.index) || (currentIndex + 1);
    const nextMarked = new Set(markedForReview);

    if (nextMarked.has(currentQIndex)) {
      nextMarked.delete(currentQIndex);
    } else {
      nextMarked.add(currentQIndex);
    }
    setMarkedForReview(nextMarked);

    const nextVisited = new Set(visited).add(currentIndex + 2);
    setVisited(nextVisited);

    const nextIndex = Math.min(currentIndex + 1, questions.length - 1);
    setCurrentIndex(nextIndex);

    persistCbtProgress(answers, nextMarked, nextVisited, nextIndex, timeLeft);
  };

  // Direct Jump from Question Palette
  const goToQuestion = (idx) => {
    const qNumber = (questions[idx]?.index) || (idx + 1);
    const nextVisited = new Set(visited).add(qNumber);
    setVisited(nextVisited);
    setCurrentIndex(idx);
    persistCbtProgress(answers, markedForReview, nextVisited, idx, timeLeft);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!cbtTest || submitting) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      let endpoint = '';
      let payload = {};

      if (id) {
        endpoint = `/mock-tests/${id}/submit`;
        payload = {
          responses: questions.map((q) => ({
            questionId: q.id || q._id,
            selectedAnswer: answers[q.index] || answers[q.id] || null,
            isMarkedForReview: markedForReview.has(q.index),
            timeSpentSeconds: 60
          })),
          timeSpentSeconds: ((cbtTest.durationMinutes || 60) * 60) - timeLeft
        };
      } else {
        endpoint = '/mock-tests/cbt/submit';
        payload = {
          testId: cbtTest.id,
          answers,
          timeTakenSeconds: ((cbtTest.durationMinutes || 60) * 60) - timeLeft
        };
      }

      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        setResult(res.data);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit CBT Examination.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Launching Secure CBT Testing Console</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Loading verified questions, marking schema, and synchronizing candidate session.</p>
        </div>
      </div>
    );
  }

  // Error or Empty Questions State
  if (loadError || (!cbtTest || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex items-center justify-center p-4 text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full bg-white dark:bg-navy-900 rounded-3xl p-8 border border-red-200 dark:border-red-500/30 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-500/30">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">CBT Console Notification</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {loadError || 'The questions for this examination are currently being initialized. Please retry or choose another exam.'}
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={fetchCbtTest}
              className="w-full py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Launching CBT</span>
            </button>
            <Link
              to="/dashboard"
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold text-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CBT Results View
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-10 px-4 sm:px-6 text-slate-900 dark:text-slate-100">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-electric-blue/40 shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-electric-blue to-neon-purple p-0.5 mx-auto">
              <div className="w-full h-full bg-slate-50 dark:bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-8 h-8 text-electric-blue dark:text-neon-cyan" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                Official CBT Submission Scored
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
                {cbtTest?.title || 'Daily CBT Examination Result'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Candidate: <strong className="text-slate-900 dark:text-white">{user?.name || 'Aspirant'}</strong> • Exam Code: {cbtTest?.examCode}
              </p>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{result.score || 0}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Marks Scored</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{result.totalCorrect || 0}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Correct Qs</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800">
                <div className="text-2xl font-black text-rose-600 dark:text-red-400">{result.totalWrong || 0}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Wrong Qs</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">-{result.negativeMarksDeducted || 0}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Negative Marks</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800">
                <div className="text-2xl font-black text-electric-blue dark:text-neon-cyan">{result.accuracyPercentage || 0}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Accuracy</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setMarkedForReview(new Set());
                  setVisited(new Set([1]));
                  setCurrentIndex(0);
                  fetchCbtTest(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold shadow-glow-blue hover:brightness-110 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-take Test / Start Fresh CBT</span>
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
              >
                Return to Dashboard
              </Link>
              <Link
                to="/analytics"
                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:text-white"
              >
                View Analytics
              </Link>
            </div>
          </motion.div>

          {/* Question-Wise Detailed Review Section */}
          {result.questionReviews && result.questionReviews.length > 0 && (
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-electric-blue dark:text-neon-cyan" /> Question-By-Question Official Review & Solutions
              </h2>

              <div className="space-y-4">
                {result.questionReviews.map((rev) => (
                  <div
                    key={rev.index}
                    className={`p-5 rounded-2xl border ${
                      rev.isCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40 text-slate-900 dark:text-white'
                        : rev.selectedAnswer
                          ? 'bg-rose-50/70 dark:bg-red-950/20 border-rose-200 dark:border-red-500/40 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-navy-900/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600 dark:text-slate-300">Question {rev.index} ({rev.topic || 'General'})</span>
                      <span className={rev.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : rev.selectedAnswer ? 'text-rose-600 dark:text-red-400' : 'text-slate-500'}>
                        {rev.isCorrect ? `+${rev.marksAwarded} Marks` : rev.selectedAnswer ? `${rev.marksAwarded} Penalty` : 'Not Attempted'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      {rev.questionText}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                        Your Answer: <strong className={rev.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-red-400'}>
                          {Array.isArray(rev.selectedAnswer) ? rev.selectedAnswer.join(', ') : (rev.selectedAnswer || 'None')}
                        </strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                        Official Answer: <strong className="text-emerald-600 dark:text-emerald-400">
                          {Array.isArray(rev.correctAnswer) ? rev.correctAnswer.join(', ') : rev.correctAnswer}
                        </strong>
                      </div>
                    </div>

                    {rev.explanation && (
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-electric-blue dark:text-neon-cyan block mb-1">Conceptual Explanation:</strong>
                        {rev.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const qIndexNum = currentQ?.index || (currentIndex + 1);
  const qKey = String(qIndexNum);
  const currentAnswer = answers[qKey] || answers[currentQ?.id];

  // Palette Counts
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const notVisitedCount = Math.max(0, questions.length - visited.size);
  const notAnsweredCount = Math.max(0, visited.size - answeredCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top CBT Examination Control Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md dark:shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/mock-tests" className="p-1.5 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" title="Leave Test">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {language === 'hi' && cbtTest?.hindiTitle ? cbtTest.hindiTitle : cbtTest?.title}
              </h1>
              {/* Exam Selector if on generic CBT */}
              {!id && (
                <select
                  value={examCode}
                  onChange={(e) => {
                    setExamCode(e.target.value);
                    setQuestions([]);
                    setCbtTest(null);
                    setAnswers({});
                  }}
                  className="bg-slate-50 dark:bg-navy-950 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-electric-blue/40 rounded-lg px-2 py-0.5 text-xs font-semibold focus:outline-none cursor-pointer max-w-[220px] truncate"
                >
                  {Object.entries(
                    CBT_EXAMS.reduce((acc, ex) => {
                      const grp = ex.group || ex.category || 'Other';
                      if (!acc[grp]) acc[grp] = [];
                      acc[grp].push(ex);
                      return acc;
                    }, {})
                  ).map(([groupName, groupExams]) => (
                    <optgroup key={groupName} label={groupName} className="bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300">
                      {groupExams.map(ex => (
                        <option key={ex.code} value={ex.code} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                          {ex.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span>+{cbtTest?.positiveMarks || 2} Marks</span>
              <span>-{cbtTest?.negativeMarks || 0.66} Negative</span>
              <span className="text-electric-blue dark:text-neon-cyan font-bold">Candidate: {user?.name || 'Aspirant'}</span>
              {saveIndicator && <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ {saveIndicator}</span>}
            </div>
          </div>
        </div>

        {/* Timer, Language & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>

          {!id && (
            <button
              onClick={() => fetchCbtTest(true)}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              title="Invoke Google Gemini API directly to fetch fresh questions"
            >
              <Sparkles className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Live AI API</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Countdown Clock with Question-Adjusted Timing */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            timeLeft < 300
              ? 'bg-rose-50 dark:bg-red-950/60 border-rose-300 dark:border-red-500/60 text-rose-600 dark:text-red-400 animate-pulse'
              : 'bg-slate-100 dark:bg-navy-950 border-electric-blue/30 text-electric-blue dark:text-neon-cyan'
          }`} title={`Exam Pacing: ${cbtTest?.durationMinutes} mins allocated for ${questions.length} questions (~${cbtTest?.secondsPerQuestion || 72}s/q)`}>
            <Clock className="w-4 h-4 text-electric-blue" />
            <span>{formatTimer(timeLeft)}</span>
            {cbtTest?.durationMinutes && (
              <span className="text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 hidden sm:inline">
                {cbtTest.durationMinutes}m ({questions.length}Q)
              </span>
            )}
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-extrabold shadow-glow-blue hover:brightness-110"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Testing Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (3 spans): Active Question & Option Selectors */}
        <div className="lg:col-span-3 bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            {/* Question Header & Subject */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Question {qIndexNum} of {questions.length}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-electric-blue dark:text-neon-cyan text-xs font-semibold">
                {currentQ?.subject || 'Syllabus Core'}
              </span>
            </div>

            {/* Question Text & Badges */}
            <div className="mb-4 flex items-center gap-2">
              {currentQ?.questionType === 'multiple_choice' && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-bold">
                  MSQ (Multiple Select) • One or more options may be correct
                </span>
              )}
              {currentQ?.questionType === 'numerical' && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold">
                  NAT (Numerical Answer Type) • Enter numerical value
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
              {language === 'hi' && currentQ?.questionHindi ? currentQ.questionHindi : currentQ?.questionText}
            </h2>

            {/* NAT Numerical Input Form */}
            {currentQ?.questionType === 'numerical' ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Candidate Numerical Response:
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="Type your calculated answer here..."
                  value={currentAnswer || ''}
                  onChange={(e) => handleInputNumerical(qKey, e.target.value)}
                  className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white dark:bg-navy-950 border border-slate-300 dark:border-slate-700 text-sm font-mono text-electric-blue dark:text-neon-cyan focus:outline-none focus:border-electric-blue"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Virtual calculator values can be entered directly. No negative marking applies for NAT questions.
                </span>
              </div>
            ) : (
              /* MCQ & MSQ Options */
              <div className="space-y-3">
                {(currentQ?.options || []).map((opt) => {
                  const isMSQ = currentQ?.questionType === 'multiple_choice';
                  const isSelected = isMSQ
                    ? (Array.isArray(currentAnswer) && currentAnswer.includes(opt.key))
                    : currentAnswer === opt.key;
                  const hindiOpt = (currentQ?.optionsHindi || []).find(h => h.key === opt.key);

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(qKey, opt.key, isMSQ)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-electric-blue/20 border-blue-500 dark:border-neon-cyan text-blue-900 dark:text-white shadow-sm dark:shadow-glow-cyan'
                          : 'bg-slate-50/80 dark:bg-navy-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        isSelected ? 'bg-electric-blue text-white' : 'bg-slate-200 dark:bg-navy-950 text-slate-700 dark:text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      <div className="text-sm font-semibold flex-1 leading-snug">
                        <div>{language === 'hi' && hindiOpt?.text ? hindiOpt.text : opt.text}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CBT Bottom Action Buttons */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearResponse}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Response
              </button>

              <button
                type="button"
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-200 dark:hover:bg-purple-900/60 transition flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" /> Mark for Review & Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white text-xs font-black shadow-glow-blue hover:brightness-110 transition flex items-center gap-1.5"
              >
                <span>Save & Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Question Palette & Official NTA Legend */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Question Palette (50 Questions)
            </h3>

            {/* Official CBT Color Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">{answeredCount}</span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center font-bold text-[9px]">{notAnsweredCount}</span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">{markedCount}</span>
                <span>Marked Review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold text-[9px]">{notVisitedCount}</span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* 50-Question Palette Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const qNum = q.index || (idx + 1);
                const hasAnswer = Boolean(answers[String(qNum)] || answers[q.id]);
                const isMarked = markedForReview.has(qNum);
                const isVisited = visited.has(qNum);
                const isCurrent = idx === currentIndex;

                let badgeColor = 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'; // Not visited

                if (hasAnswer && isMarked) {
                  badgeColor = 'bg-purple-800 border-emerald-400 text-white ring-1 ring-emerald-400 font-bold';
                } else if (isMarked) {
                  badgeColor = 'bg-purple-600 border-purple-400 text-white font-bold';
                } else if (hasAnswer) {
                  badgeColor = 'bg-emerald-600 border-emerald-500 text-white font-bold';
                } else if (isVisited) {
                  badgeColor = 'bg-red-600 border-red-500 text-white font-bold';
                }

                if (isCurrent) {
                  badgeColor += ' ring-2 ring-electric-blue dark:ring-neon-cyan shadow-sm dark:shadow-glow-cyan';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`h-9 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center ${badgeColor}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-black shadow-glow-blue hover:brightness-110"
            >
              Submit Entire Examination
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-electric-blue/40 shadow-2xl text-center space-y-5"
          >
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Confirm Examination Submission</h3>

            <div className="grid grid-cols-3 gap-2 text-xs py-3 border-y border-slate-200 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{answeredCount}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Answered</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
                <div className="text-lg font-black text-rose-600 dark:text-red-400">{notAnsweredCount}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Unanswered</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
                <div className="text-lg font-black text-purple-600 dark:text-purple-400">{markedCount}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Marked</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Once submitted, your responses will be locked and officially evaluated on the server with negative marking.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
              >
                {submitting ? 'Submitting & Evaluating...' : 'Yes, Submit Test'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:text-white"
              >
                Return to Test
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
