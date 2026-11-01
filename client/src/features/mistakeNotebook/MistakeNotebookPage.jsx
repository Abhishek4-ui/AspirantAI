import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookMarked, CheckCircle2, Trash2, Search, Filter, AlertCircle, ArrowRight } from 'lucide-react';

export default function MistakeNotebookPage() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [subjectFilter]);

  const fetchEntries = async () => {
    try {
      const res = await api.get(`/mistake-notebook?subject=${subjectFilter}`);
      if (res.data.success) {
        setEntries(res.data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResolve = async (id) => {
    try {
      const res = await api.patch(`/mistake-notebook/${id}/resolve`);
      if (res.data.success) {
        setEntries(prev => prev.map(e => e._id === id ? res.data.entry : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/mistake-notebook/${id}`);
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold mb-3">
          <BookMarked className="w-3.5 h-3.5" /> High-Impact Error Log
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">AI Mistake Notebook</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Review every question you answered incorrectly. Preventing repeated mistakes is the fastest path to selection.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Indian Polity', 'Modern History', 'Quantitative Aptitude', 'General Science'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subjectFilter === sub ? 'bg-electric-blue text-white shadow-glow-blue' : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading error log...</div>
      ) : entries.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          No recorded mistakes in this category. Excellent accuracy!
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry._id} className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-neon-cyan">{entry.subject} • {entry.topic}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleResolve(entry._id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      entry.isResolved ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {entry.isResolved ? '✓ Resolved' : 'Mark as Understood'}
                  </button>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {entry.questionText}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300">
                  <span className="font-bold block mb-0.5">Your Choice:</span>
                  Option {entry.studentAnswer || 'Unanswered'}
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                  <span className="font-bold block mb-0.5">Correct Answer:</span>
                  Option {entry.correctAnswer}
                </div>
              </div>

              {entry.explanation && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-slate-200 block mb-1">Pedagogical Explanation:</strong>
                  {entry.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
