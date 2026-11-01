import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { GraduationCap, BookOpen, Layers, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function Class10BoardPage() {
  const [boardCode, setBoardCode] = useState('CBSE');
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/boards/${boardCode}/10`).then(res => {
      if (res.data.success) {
        setBoardData(res.data);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [boardCode]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
          <GraduationCap className="w-3.5 h-3.5" /> High School Board Masteries
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Class 10th Board Exam Preparation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Structured syllabus notes, NCERT worked examples, chapter-wise MCQs, formulas, and verified PYQs for CBSE & State Boards.
        </p>
      </div>

      {/* Board Selector */}
      <div className="flex justify-center gap-3">
        {['CBSE', 'BSEB'].map((code) => (
          <button
            key={code}
            onClick={() => setBoardCode(code)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              boardCode === code
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {code === 'CBSE' ? 'CBSE National Board' : 'Bihar Board (BSEB)'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading board curriculum...</div>
      ) : (
        <div className="space-y-8">
          {boardData?.streams?.[0]?.subjects?.map((sub) => (
            <div key={sub.code} className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{sub.name}</h3>
                  {sub.hindiName && <span className="text-xs text-slate-500 dark:text-slate-400">{sub.hindiName}</span>}
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-neon-cyan px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-slate-700">
                  {sub.chapters?.length || 0} Key Chapters
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {sub.chapters?.map((ch) => (
                  <div key={ch.chapterNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>Chapter {ch.chapterNumber}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{ch.practiceQuestionCount || 40}+ MCQs</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{ch.title}</h4>
                      {ch.hindiTitle && <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{ch.hindiTitle}</div>}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{ch.revisionNotes}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                      <Link to="/cbt-simulator?examCode=CLASS_10" className="text-blue-600 dark:text-neon-cyan font-bold hover:underline">
                        Practice Class 10 Board Test →
                      </Link>
                      <Link to="/ai-tutor/doubts" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        Ask Doubt
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
