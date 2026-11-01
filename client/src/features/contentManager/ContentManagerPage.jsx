import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Database, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ContentManagerPage() {
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/questions/pending');
      if (res.data.success) {
        setPendingQuestions(res.data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await api.patch(`/admin/questions/${id}/review`, { validationStatus: status });
      setPendingQuestions(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Content Quality & Question Review</h1>
        <p className="text-xs text-slate-400 mt-1">Review AI-generated question consistency, answer keys, and Hindi translations</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading pending reviews...</div>
      ) : pendingQuestions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400">
          No questions pending editorial review. Question bank is fully validated!
        </div>
      ) : (
        <div className="space-y-4">
          {pendingQuestions.map((q) => (
            <div key={q._id} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-bold text-neon-cyan">{q.subject} • {q.topic}</span>
                <span className="text-slate-400">Generated: {q.generationMethod}</span>
              </div>

              <h3 className="text-sm font-bold text-white leading-relaxed">{q.questionText}</h3>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleReview(q._id, 'flagged')}
                  className="px-4 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold"
                >
                  Reject Question
                </button>
                <button
                  onClick={() => handleReview(q._id, 'approved')}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                >
                  Approve to Bank
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
