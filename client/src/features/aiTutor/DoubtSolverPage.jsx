import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Send, BookOpen, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

export default function DoubtSolverPage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('en');
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/ai-services/doubt-solver', {
        question,
        examCategory: user?.primaryExamId || 'Competitive Exam',
        language
      });
      if (res.data.success) {
        setSolution(res.data.solution);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Explain the doctrine of Basic Structure of the Indian Constitution with key landmark cases.',
    'A train 150m long passes a bridge 250m long in 20 seconds. What is its speed in km/h?',
    'What is the difference between Monetary Policy and Fiscal Policy in India?'
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 border border-electric-blue/20 dark:border-electric-blue/30 text-electric-blue dark:text-neon-cyan text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Conceptual Step-by-Step Solver
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">AI Doubt Solver</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Ask any concept, formula, or problem in Hindi or English. Receive verified pedagogical derivations and shortcut tips.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSolve} className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <label className="font-semibold text-slate-700 dark:text-slate-200">Enter your question or problem statement:</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${language === 'en' ? 'bg-electric-blue text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${language === 'hi' ? 'bg-electric-blue text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type or paste your doubt here... (e.g. In triangle ABC right angled at B...)"
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
        />

        {/* Sample Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] py-1">Try asking:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuestion(sq)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-electric-blue dark:hover:text-neon-cyan hover:border-slate-300 dark:hover:border-slate-700 text-left line-clamp-1 max-w-xs"
            >
              {sq}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Solving...' : 'Get Step-by-Step Solution'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Solution Output */}
      {solution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-electric-blue/40 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-electric-blue dark:text-neon-cyan uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified AI Solution
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{solution.sourceAttribution}</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Step-by-Step Derivation</h4>
            {solution.stepByStepSolution?.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-800/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                {step}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-electric-blue/10 border border-blue-200 dark:border-electric-blue/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <strong className="text-electric-blue dark:text-neon-cyan block mb-1">Key Insight & Exam Shortcut:</strong>
            {solution.detailedExplanation}
          </div>
        </motion.div>
      )}
    </div>
  );
}
