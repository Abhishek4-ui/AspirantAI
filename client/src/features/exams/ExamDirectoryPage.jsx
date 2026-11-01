import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Compass, Search, BookOpen, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ExamDirectoryPage() {
  const [exams, setExams] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'Civil Services', 'State PSC', 'SSC', 'Banking', 'Railway', 'Defence', 'Teaching', 'Police'
  ];

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get(`/exams?category=${category}&search=${encodeURIComponent(search)}`);
        if (res.data.success) {
          setExams(res.data.exams);
        }
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Directory Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 border border-electric-blue/20 dark:border-electric-blue/30 text-electric-blue dark:text-neon-cyan text-xs font-bold mb-3">
          <Compass className="w-3.5 h-3.5" /> All-India Central & State Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          All-India Exam Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Verified details, conducting authorities, eligibility, syllabus breakdown, and negative marking rules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                category === cat
                  ? 'bg-electric-blue text-white shadow-glow-blue'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam code/title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-xs">Loading verified exam profiles...</div>
      ) : exams.length === 0 ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400 text-xs">No exams found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <motion.div
              key={exam.code}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-700">
                    {exam.category}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{exam.code}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{exam.title}</h3>
                {exam.hindiTitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{exam.hindiTitle}</p>
                )}
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Conducting Body: <strong className="text-slate-800 dark:text-slate-200">{exam.conductingAuthority}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1 mb-4">
                  <div><strong>Qualification:</strong> {exam.qualification}</div>
                  <div><strong>Negative Marking:</strong> {exam.examPattern?.negativeMarking?.fraction || 'Applicable'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to={`/exams/${exam.code}`}
                  className="text-xs font-bold text-electric-blue dark:text-neon-cyan hover:underline inline-flex items-center gap-1"
                >
                  Full Pattern & Syllabus <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {exam.officialNotificationUrl && (
                  <a
                    href={exam.officialNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
