import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MASTER_EXAM_CATALOG } from '../../constants/examCatalog';
import {
  Clock, CheckCircle, HelpCircle, ChevronLeft, ChevronRight,
  Flag, RotateCcw, AlertTriangle, Send, Sparkles, Award,
  CheckCircle2, BookOpen, Layers, ArrowRight, ArrowLeft
} from 'lucide-react';

const SUPPORTED_EXAMS = MASTER_EXAM_CATALOG;

export default function DailyQuizPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedExamCode, setSelectedExamCode] = useState(searchParams.get('examCode') || 'UPSC_CSE');
  const [quizLanguage, setQuizLanguage] = useState(searchParams.get('lang') || 'en');
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({}); // { [questionId]: selectedOption }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(7200);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  const timerRef = useRef(null);

  // Sync state if URL query params change
  useEffect(() => {
    const qExam = searchParams.get('examCode');
    const qLang = searchParams.get('lang');
    if (qExam && qExam !== selectedExamCode) setSelectedExamCode(qExam);
    if (qLang && qLang !== quizLanguage) setQuizLanguage(qLang);
  }, [searchParams]);

  useEffect(() => {
    fetchQuiz();
  }, [selectedExamCode, quizLanguage]);

  const fetchQuiz = async (force = false) => {
    try {
      setLoading(true);
      setSubmittedResult(null);

      const res = await api.get('/daily-quiz/today', {
        params: {
          examCode: selectedExamCode,
          language: quizLanguage,
          ...(force ? { force: 'true' } : {})
        }
      });

      if (res.data.success && res.data.quiz) {
        const qData = res.data.quiz;
        setQuiz(qData);
        setQuestions(qData.questions || []);

        if (res.data.completedAttempt) {
          setSubmittedResult(res.data.completedAttempt);
        } else if (res.data.activeAttempt) {
          const act = res.data.activeAttempt;
          setResponses(act.savedAnswers || {});
          setMarkedForReview(new Set(act.markedForReviewList || []));
          setTimeLeftSeconds(act.timeLeftSeconds || (qData.totalDurationSeconds || (qData.durationMinutes * 60)));
          setCurrentIndex(act.currentIndex || 0);
        } else {
          setResponses({});
          setMarkedForReview(new Set());
          setTimeLeftSeconds(qData.totalDurationSeconds || ((qData.durationMinutes || 120) * 60));
          setCurrentIndex(0);
        }
      }
    } catch (err) {
      console.error('Failed to load daily quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (loading || submittedResult || !quiz || timeLeftSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, submittedResult, quiz, timeLeftSeconds]);

  // Real-time progress persister
  const persistProgress = async (newAnswers, newMarked, newIndex, newTime) => {
    if (!quiz || submittedResult) return;
    try {
      await api.put('/daily-quiz/attempt/progress', {
        quizId: quiz.id,
        answers: newAnswers !== undefined ? newAnswers : responses,
        markedForReviewList: Array.from(newMarked !== undefined ? newMarked : markedForReview),
        timeLeftSeconds: newTime !== undefined ? newTime : timeLeftSeconds,
        currentIndex: newIndex !== undefined ? newIndex : currentIndex
      });
      setSaveNotice('Progress saved');
      setTimeout(() => setSaveNotice(''), 2000);
    } catch (err) {
      // Quiet fail for offline/guest
    }
  };

  const handleSelectOption = (optionKey) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const nextAnswers = {
      ...responses,
      [currentQ.id]: optionKey
    };
    setResponses(nextAnswers);
    persistProgress(nextAnswers, markedForReview, currentIndex, timeLeftSeconds);
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const nextAnswers = { ...responses };
    delete nextAnswers[currentQ.id];
    setResponses(nextAnswers);
    persistProgress(nextAnswers, markedForReview, currentIndex, timeLeftSeconds);
  };

  const handleToggleReview = () => {
    const nextMarked = new Set(markedForReview);
    if (nextMarked.has(currentIndex)) {
      nextMarked.delete(currentIndex);
    } else {
      nextMarked.add(currentIndex);
    }
    setMarkedForReview(nextMarked);
    persistProgress(responses, nextMarked, currentIndex, timeLeftSeconds);
  };

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIndex(idx);
      persistProgress(responses, markedForReview, idx, timeLeftSeconds);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);
    setConfirmSubmitOpen(false);

    try {
      const payload = {
        answers: responses,
        timeSpentSeconds: ((quiz.durationMinutes || 120) * 60) - timeLeftSeconds
      };

      const res = await api.post(`/daily-quiz/${quiz.id}/submit`, payload);
      if (res.data.success) {
        setSubmittedResult(res.data);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
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
      <div className="min-h-[80vh] flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold text-slate-900 dark:text-white">Loading Today's 100-Question AI Grand Quiz...</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Assembling syllabus-specific questions and restoring your progress.</p>
        </div>
      </div>
    );
  }

  // Submitted Result View
  if (submittedResult) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-electric-blue/40 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-electric-blue p-0.5 mx-auto">
            <div className="w-full h-full bg-slate-50 dark:bg-navy-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
              Assessment Completed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
              Daily AI Quiz Evaluation Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{quiz?.title}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{submittedResult.score || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Marks Obtained</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{submittedResult.totalCorrect || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Correct Answers</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-rose-600 dark:text-red-400">{submittedResult.totalWrong || 0}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Incorrect Answers</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-electric-blue dark:text-neon-cyan">{submittedResult.accuracyPercentage || 0}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mt-1">Accuracy</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedResult(null);
                setResponses({});
                setMarkedForReview(new Set());
                setCurrentIndex(0);
                fetchQuiz(true);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold shadow-glow-blue hover:brightness-110 flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Fresh Quiz Attempt</span>
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/cbt-simulator"
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:text-white"
            >
              Take 50-Question Daily CBT Mock
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(responses).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-electric-blue/10 dark:bg-electric-blue/20 text-electric-blue dark:text-neon-cyan border border-electric-blue/20 dark:border-electric-blue/30 text-[11px] font-bold">
              100 QUESTIONS GRAND QUIZ
            </span>
            {saveNotice && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                ✓ {saveNotice}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{quiz?.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Exam Selector */}
          <select
            value={selectedExamCode}
            onChange={(e) => {
              setSelectedExamCode(e.target.value);
              setQuestions([]);
              setQuiz(null);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none max-w-[260px] truncate"
          >
            {Object.entries(
              SUPPORTED_EXAMS.reduce((acc, ex) => {
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

          {/* Language Toggle */}
          <button
            onClick={() => setQuizLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-900 border border-electric-blue/30 text-xs font-bold text-electric-blue dark:text-neon-cyan hover:bg-slate-100 dark:hover:bg-navy-800 transition"
          >
            {quizLanguage === 'en' ? 'हिन्दी' : 'English'}
          </button>

          {/* Fetch Fresh Questions via Live AI API */}
          <button
            onClick={() => fetchQuiz(true)}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50"
            title="Invoke Google Gemini API directly to fetch fresh questions"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Fetch via Live AI API</span>
            <span className="sm:hidden">Live API</span>
          </button>

          {/* Timer Display with Dynamic Question-Paced Duration */}
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-950 border border-electric-blue/30 text-electric-blue dark:text-neon-cyan font-mono font-bold text-sm flex items-center gap-2" title={`Allocated: ${quiz?.durationMinutes} mins (${questions.length} Questions @ ~${quiz?.secondsPerQuestion || 72}s each)`}>
            <Clock className="w-4 h-4 text-electric-blue animate-pulse" />
            <span>{formatTimer(timeLeftSeconds)}</span>
            {quiz?.durationMinutes && (
              <span className="text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 hidden sm:inline">
                {quiz.durationMinutes}m ({questions.length}Q)
              </span>
            )}
          </div>

          <button
            onClick={() => setConfirmSubmitOpen(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      {/* Main Grid: Question Card & Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Question Box */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-900 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-800 font-semibold">
                {currentQ?.subject || 'General Studies'}
              </span>
              <button
                onClick={handleToggleReview}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-bold ${
                  markedForReview.has(currentIndex)
                    ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-500 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{markedForReview.has(currentIndex) ? 'Marked' : 'Mark'}</span>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {quizLanguage === 'hi' && currentQ?.questionHindi ? currentQ.questionHindi : currentQ?.questionText}
            </h2>
            {quizLanguage !== 'hi' && currentQ?.questionHindi && (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                {currentQ.questionHindi}
              </p>
            )}
          </div>

          {/* 4 Answer Options */}
          <div className="space-y-3 pt-2">
            {(currentQ?.options || []).map((opt) => {
              const isSelected = responses[currentQ.id] === opt.key;
              const hindiOpt = (currentQ?.optionsHindi || []).find(h => h.key === opt.key);

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-electric-blue/15 border-blue-500 dark:border-neon-cyan text-blue-900 dark:text-white shadow-sm dark:shadow-glow-cyan'
                      : 'bg-slate-50/80 dark:bg-navy-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isSelected ? 'bg-electric-blue text-white' : 'bg-slate-200 dark:bg-navy-950 text-slate-700 dark:text-slate-400'
                  }`}>
                    {opt.key}
                  </span>
                  <div className="text-sm font-semibold flex-1 leading-snug">
                    <div>{quizLanguage === 'hi' && hindiOpt?.text ? hindiOpt.text : opt.text}</div>
                    {quizLanguage !== 'hi' && hindiOpt?.text && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{hindiOpt.text}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleClearResponse}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Response
            </button>

            <div className="flex gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => goToQuestion(currentIndex + 1)}
                className="px-5 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110 disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>

        {/* 100-Question Palette & Progress */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Question Palette (100 MCQs)
            </h3>
            <span className="text-xs font-bold text-electric-blue dark:text-neon-cyan">
              {answeredCount} / {questions.length} Answered
            </span>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800 py-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" /> Marked
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" /> Unanswered
            </div>
          </div>

          {/* Grid of 100 buttons */}
          <div className="grid grid-cols-10 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(responses[q.id]);
              const isMarked = markedForReview.has(idx);
              const isCurrent = idx === currentIndex;

              let btnClass = 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
              if (isAnswered && isMarked) btnClass = 'bg-purple-700 border-emerald-400 text-white font-bold';
              else if (isAnswered) btnClass = 'bg-emerald-600 border-emerald-500 text-white font-bold';
              else if (isMarked) btnClass = 'bg-purple-600 border-purple-400 text-white font-bold';

              if (isCurrent) btnClass += ' ring-2 ring-electric-blue dark:ring-neon-cyan';

              return (
                <button
                  key={idx}
                  onClick={() => goToQuestion(idx)}
                  className={`h-7 rounded-lg border text-xs font-mono font-bold transition flex items-center justify-center ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setConfirmSubmitOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
            >
              Submit Grand Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-electric-blue/40 shadow-2xl text-center space-y-4"
          >
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Submit 100-Question Grand Quiz?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You have answered <strong className="text-emerald-600 dark:text-emerald-400">{answeredCount}</strong> out of <strong className="text-slate-900 dark:text-white">{questions.length}</strong> questions.
              {markedForReview.size > 0 && ` (${markedForReview.size} questions marked for review).`}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={handleSubmitQuiz}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
              >
                {isSubmitting ? 'Evaluating...' : 'Yes, Submit Test'}
              </button>
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
