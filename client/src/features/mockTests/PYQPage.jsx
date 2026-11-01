import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Award, CheckCircle2, FileText, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PYQPage() {
  const [papers, setPapers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPyqs();
  }, [selectedCategory]);

  const fetchPyqs = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { examCategory: selectedCategory } : {};
      const res = await api.get('/mock-tests/pyq', { params });
      if (res.data.success) {
        setPapers(res.data.papers || []);
      }
    } catch (err) {
      console.error('Failed to load PYQ directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Civil Services', 'State PSC', 'SSC', 'GATE CSE'];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Source Provenance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Verified Previous-Year Questions (PYQ)</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Authentic examination papers cross-referenced against official authority portals with step-by-step verified explanations.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-electric-blue text-white shadow-glow-blue'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading verified previous-year papers...</div>
      ) : papers.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
          No official PYQ papers found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((p) => (
            <div key={p.id} className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-700">
                    Year {p.examinationYear}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {p.totalQuestions} Qs
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{p.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{p.paperName}</p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between mb-4">
                  <span>Source: Official Portal</span>
                  <a
                    href={p.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-electric-blue dark:text-neon-cyan hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    Authority Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <Link
                to="/cbt-simulator"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-electric-blue text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:brightness-110 shadow-glow-purple"
              >
                <FileText className="w-3.5 h-3.5" /> Solve in Timed Exam Mode
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
