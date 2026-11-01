import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Target, Award, Clock, ArrowRight, Zap, BookOpen, Layers } from 'lucide-react';
import { EXAM_CATEGORIES } from '../../constants/examCatalog';

export default function MockTestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mockSeries, setMockSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMocks();
  }, [selectedCategory]);

  const fetchMocks = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const res = await api.get('/mock-tests', { params });
      if (res.data.success) {
        setMockSeries(res.data.mocks || []);
      }
    } catch (err) {
      console.error('Failed to load mock tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = EXAM_CATEGORIES;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 border border-electric-blue/20 dark:border-electric-blue/30 text-electric-blue dark:text-neon-cyan text-xs font-bold mb-3 shadow-sm">
          <Layers className="w-3.5 h-3.5" /> NTA / TCS-iON Grade Examination Console
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Full-Length Mock Test Series</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Server-evaluated full mocks matching real exam patterns, strict countdown timers, and negative marking schemes.
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
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading verified full-length mock examinations...</div>
      ) : mockSeries.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
          No mock examinations found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSeries.map((mock) => (
            <div key={mock.id} className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-700">
                    {mock.examCategory}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">-{mock.negativeMarks} Negative</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{mock.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{mock.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  <span className="flex items-center gap-1 font-semibold"><Clock className="w-3.5 h-3.5 text-electric-blue" /> {mock.durationMinutes} Mins</span>
                  <span className="flex items-center gap-1 font-semibold"><Target className="w-3.5 h-3.5 text-emerald-500" /> {mock.totalQuestions} Qs</span>
                  <span className="flex items-center gap-1 font-semibold"><Award className="w-3.5 h-3.5 text-purple-500" /> {mock.totalMarks} Marks</span>
                </div>
              </div>

              <Link
                to={`/cbt-simulator/${mock.id}`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:brightness-110 shadow-glow-blue"
              >
                <span>Launch CBT Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
