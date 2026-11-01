import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import {
  Sparkles, Award, Send, CheckCircle2, AlertCircle, ArrowRight,
  Code, MessageSquare, Database, RefreshCw, Layers, Star
} from 'lucide-react';

export default function InterviewPrepPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [role, setRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('entry');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/interviews');
      if (res.data.success) {
        setSessions(res.data.sessions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    setStarting(true);
    try {
      const res = await api.post('/interviews/start', { role, interviewType, difficulty });
      if (res.data.success) {
        setActiveSession(res.data.session);
        setCurrentAnswer('');
        fetchSessions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start interview session.');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeSession || !currentAnswer.trim() || evaluating) return;
    setEvaluating(true);

    try {
      const res = await api.post(`/interviews/${activeSession._id}/answer`, {
        questionIndex: activeSession.currentQuestionIndex,
        answer: currentAnswer
      });

      if (res.data.success) {
        // Refresh session
        const updatedQuestions = [...activeSession.questions];
        updatedQuestions[activeSession.currentQuestionIndex] = res.data.question;

        setActiveSession(prev => ({
          ...prev,
          questions: updatedQuestions,
          currentQuestionIndex: res.data.nextIndex
        }));
        setCurrentAnswer('');

        if (res.data.isLastQuestion) {
          // Finish session
          const finishRes = await api.post(`/interviews/${activeSession._id}/finish`);
          if (finishRes.data.success) {
            setActiveSession(finishRes.data.session);
            fetchSessions();
          }
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = activeSession?.questions?.[activeSession?.currentQuestionIndex];
  const isCompleted = activeSession?.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5" /> AI Technical & Behavioral Interview Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">AI Mock Interview Simulator</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Practice realistic technical questions, DSA explanations, and behavioral interviews with instant pedagogical scoring.
        </p>
      </div>

      {/* Start Session Setup Bar */}
      {!activeSession && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-neon-cyan" /> Configure Your Interview Session
          </h2>

          <form onSubmit={handleStartSession} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-navy-900 border border-slate-700"
              >
                <option value="Software Engineer">Software Engineer (General)</option>
                <option value="Frontend Developer">Frontend Developer (React)</option>
                <option value="Backend Developer">Backend Developer (Node.js/APIs)</option>
                <option value="Full Stack Developer">Full Stack Developer (MERN)</option>
                <option value="Data Scientist">Data Scientist / ML Engineer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interview Focus</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-navy-900 border border-slate-700"
              >
                <option value="technical">Technical Deep Dive</option>
                <option value="dsa">DSA & Algorithmic Logic</option>
                <option value="sql">SQL & Database Systems</option>
                <option value="hr">HR & Behavioral (STAR)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-navy-900 border border-slate-700"
              >
                <option value="entry">Entry-Level / Fresher</option>
                <option value="intermediate">Mid-Level (1-3 Yrs)</option>
                <option value="advanced">Senior / Lead</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                disabled={starting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>{starting ? 'Starting Simulation...' : 'Launch Live Mock Interview'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Interview Panel */}
      {activeSession && (
        <div className="space-y-6">
          <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{activeSession.role}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-navy-800 text-neon-cyan border border-slate-700 uppercase font-bold text-[10px]">
                {activeSession.interviewType}
              </span>
            </div>
            <button
              onClick={() => setActiveSession(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Exit Session
            </button>
          </div>

          {!isCompleted && currentQ && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-electric-blue/40 space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
                <span className="font-bold text-neon-cyan">
                  Question {activeSession.currentQuestionIndex + 1} of {activeSession.questions.length}
                </span>
                <span>Category: {currentQ.category}</span>
              </div>

              <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.questionText}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Your Answer (Articulate your technical reasoning, tradeoffs, or code structure):
                </label>
                <textarea
                  rows={6}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Explain your approach, steps, and core principles..."
                  className="w-full p-4 rounded-2xl glass-input text-xs sm:text-sm text-white placeholder-slate-500 bg-navy-950 font-sans"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={evaluating || !currentAnswer.trim()}
                  onClick={handleSubmitAnswer}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white text-xs font-bold shadow-glow-blue hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{evaluating ? 'Evaluating Response...' : 'Submit & Receive Feedback'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Completed Session View */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-8 border border-emerald-500/40 text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Interview Completed</span>
                <h2 className="text-2xl font-black text-white mt-1">Overall Performance Score</h2>
                <div className="text-4xl font-black text-neon-cyan mt-2">{activeSession.overallScore} / 10</div>
                <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto">{activeSession.overallFeedback}</p>
              </div>

              <div className="space-y-4 text-left max-w-3xl mx-auto pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question-by-Question Breakdown</h3>
                {activeSession.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Q{idx + 1}: {q.questionText}</span>
                      <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {q.score}/10
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 bg-navy-950/80 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-slate-300 block mb-1">Your Answer:</strong>
                      {q.userAnswer}
                    </div>
                    <div className="text-xs text-slate-200 bg-electric-blue/10 p-2.5 rounded-xl border border-electric-blue/20">
                      <strong className="text-neon-cyan block mb-1">AI Evaluation Feedback:</strong>
                      {q.aiFeedback}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveSession(null)}
                className="px-6 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
              >
                Start Another Mock Interview
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Recent Sessions History */}
      {!activeSession && sessions.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Interview Sessions</h3>
          <div className="divide-y divide-slate-800">
            {sessions.map((s) => (
              <div key={s._id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{s.role}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {s.interviewType} • {new Date(s.createdAt).toLocaleDateString()} • {s.questions?.length} Questions
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    s.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {s.status === 'completed' ? `Score: ${s.overallScore}/10` : 'In Progress'}
                  </span>
                  <button
                    onClick={() => setActiveSession(s)}
                    className="px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-neon-cyan font-bold text-[11px]"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
