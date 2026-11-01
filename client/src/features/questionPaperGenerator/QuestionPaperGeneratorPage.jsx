import React, { useState } from 'react';
import api from '../../services/api';
import { FileSpreadsheet, Sparkles, Printer, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuestionPaperGeneratorPage() {
  const [examCategory, setExamCategory] = useState('Civil Services');
  const [subject, setSubject] = useState('Indian Polity');
  const [questionCount, setQuestionCount] = useState(25);
  const [difficulty, setDifficulty] = useState('all');
  const [language, setLanguage] = useState('en');
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/question-paper/generate', {
        examCategory,
        subject,
        questionCount,
        difficulty,
        language
      });
      if (res.data.success) {
        setPaper(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <FileSpreadsheet className="w-3.5 h-3.5" /> Dynamic Assessment Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Question Paper Generator</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Design custom practice tests and printable papers from AspirantAI's validated question bank.
        </p>
      </div>

      {/* Generator Controls */}
      <form onSubmit={handleGenerate} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Exam Category</label>
            <select
              value={examCategory}
              onChange={(e) => setExamCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value="Civil Services">Civil Services (UPSC/BPSC)</option>
              <option value="SSC">SSC (CGL/CHSL)</option>
              <option value="Railway">Railway (RRB NTPC)</option>
              <option value="Banking">Banking & Insurance</option>
              <option value="Board Exams">Class 10/12 Boards</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Area</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value="Indian Polity">Indian Polity & Constitution</option>
              <option value="Modern History">Modern History & Freedom Struggle</option>
              <option value="Geography">Geography & Environment</option>
              <option value="General Science">General Science</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Count</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            >
              <option value={10}>10 Questions (Quick Quiz)</option>
              <option value={25}>25 Questions (Sectional)</option>
              <option value={50}>50 Questions (Half Mock)</option>
              <option value={100}>100 Questions (Full Paper)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Language:</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${language === 'en' ? 'bg-electric-blue text-white shadow-glow-blue' : 'bg-slate-200 dark:bg-navy-900 text-slate-700 dark:text-slate-400'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${language === 'hi' ? 'bg-electric-blue text-white shadow-glow-blue' : 'bg-slate-200 dark:bg-navy-900 text-slate-700 dark:text-slate-400'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Synthesizing Test Paper...' : 'Generate Question Paper'}
          </button>
        </div>
      </form>

      {/* Generated Paper Preview */}
      {paper && (
        <div className="glass-panel rounded-3xl p-8 border border-electric-blue/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black text-white">{paper.paperMetadata.title}</h2>
              <div className="text-xs text-slate-400">
                Total Marks: {paper.paperMetadata.totalMarks} • Time: {paper.paperMetadata.durationMinutes} Mins
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>

          <div className="space-y-6">
            {paper.questions?.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-start gap-2">
                  <span className="text-neon-cyan">Q{q.index}.</span>
                  <span>{q.questionText}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options?.map((opt) => (
                    <div key={opt.key} className="p-2 rounded-xl bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">
                      <strong className="text-slate-500 dark:text-slate-400 mr-2">{opt.key}.</strong> {opt.text}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Answer Key: Option {q.correctAnswer}</span>
                  <span className="text-slate-400">{q.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
