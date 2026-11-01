import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen, Compass, CheckCircle2, Circle, ArrowRight,
  ShieldCheck, Sparkles, Filter, ChevronDown, ChevronRight
} from 'lucide-react';

export default function SyllabusPage() {
  const [exams, setExams] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('aspirantai_completed_topics') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [expandedExams, setExpandedExams] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, [selectedCategory]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const res = await api.get('/exams', { params });
      if (res.data.success) {
        setExams(res.data.exams || []);
        if (res.data.exams?.length > 0) {
          setExpandedExams(new Set([res.data.exams[0].code]));
        }
      }
    } catch (err) {
      console.error('Failed to load exams syllabus:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicKey) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicKey)) next.delete(topicKey);
      else next.add(topicKey);
      localStorage.setItem('aspirantai_completed_topics', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleExpand = (code) => {
    setExpandedExams(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const categories = ['All', 'Civil Services', 'State PSC', 'SSC', 'Railway', 'Banking', 'Engineering'];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 border border-electric-blue/20 dark:border-electric-blue/30 text-electric-blue dark:text-neon-cyan text-xs font-bold mb-3 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Curriculum & Pattern Mapping
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Syllabus & Learning Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Track subject completion, mark mastered modules, and jump straight into targeted topic test attempts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-electric-blue text-white shadow-glow-blue'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-navy-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading verified exam syllabi...</div>
      ) : exams.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
          No syllabi found for this category.
        </div>
      ) : (
        <div className="space-y-6">
          {exams.map((exam) => {
            const isExpanded = expandedExams.has(exam.code);
            const stages = exam.examPattern?.stages || [];

            return (
              <div key={exam._id} className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleExpand(exam.code)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-navy-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-electric-blue/10 dark:bg-electric-blue/20 text-electric-blue dark:text-neon-cyan flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-700">
                          {exam.category}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{exam.code}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">{exam.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                      Authority: {exam.conductingAuthority || 'Commission'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-electric-blue dark:text-neon-cyan" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 sm:p-8 pt-0 border-t border-slate-200 dark:border-slate-800/80 space-y-6">
                    {/* Stages and Pattern */}
                    {stages.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                          Examination Structure & Stages
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {stages.map((stg, sIdx) => (
                            <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
                              <div className="font-bold text-slate-900 dark:text-white text-xs mb-1">{stg.stageName}</div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                <div>Mode: {stg.mode}</div>
                                <div>Total Marks: {stg.totalMarks}</div>
                                <div>Duration: {stg.duration}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Eligibility */}
                    {exam.qualification && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white block mb-1">Official Minimum Qualification:</strong>
                        {exam.qualification}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <Link
                        to={`/exams/${exam.code}`}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:text-white"
                      >
                        Full Exam Details
                      </Link>
                      <Link
                        to="/cbt-simulator"
                        className="px-5 py-2 rounded-xl bg-electric-blue text-white text-xs font-extrabold shadow-glow-blue hover:brightness-110 inline-flex items-center gap-1.5"
                      >
                        Practice Exam Questions <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
