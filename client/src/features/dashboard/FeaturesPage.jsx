import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FeaturesSection from '../../components/FeaturesSection';
import CreatorCredit from '../../components/CreatorCredit';

export default function FeaturesPage() {
  const specializedModules = [
    { title: 'Daily 100-Question Assessment', desc: 'Server-evaluated 100-question timed mocks with negative marking and instant accuracy breakdown.', path: '/daily-quiz' },
    { title: 'Socket.IO Live Challenges', desc: 'Compete in real-time speed quizzes with live countdowns and live competitive standings.', path: '/live-quiz' },
    { title: 'Class 10th & 12th Board Hub', desc: 'NCERT aligned chapter notes, derivation formulas, and board sample papers across PCM, PCB, Commerce, and Arts.', path: '/boards/class-10' },
    { title: 'AI Doubt Solver', desc: 'Step-by-step Hindi and English derivations with shortcut competitive examination tips.', path: '/ai-tutor/doubts' },
    { title: 'Computer Vision Image Solver', desc: 'OCR mathematical symbol extraction and resolution for textbook diagrams and numericals.', path: '/ai-tutor/image-solver' },
    { title: 'SuperMemo Spaced Flashcards', desc: 'Scientifically scheduled formula and article recall using the SM-2 spaced repetition algorithm.', path: '/flashcards' },
    { title: 'AI Mistake Notebook', desc: 'Automated logging of incorrect choices to target weak areas and prevent repeated errors.', path: '/mistake-notebook' },
    { title: 'Dynamic Question Paper Generator', desc: 'Customizable test builder and printable PDF generator from verified question banks.', path: '/paper-generator' },
    { title: 'Verified Vacancy Tracker', desc: 'Real-time gazette-verified central and state government recruitment tracker.', path: '/vacancies' }
  ];

  return (
    <div className="space-y-12">
      {/* Primary Features Section */}
      <FeaturesSection />

      {/* Extended Architectural Modules Grid */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">All Specialized System Modules</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Every tool is tightly integrated with our backend MongoDB and Gemini AI engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specializedModules.map((f) => (
            <div key={f.title} className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-400/50 dark:hover:border-slate-700 transition">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{f.desc}</p>
              </div>
              <Link to={f.path} className="text-xs font-bold text-blue-600 dark:text-neon-cyan hover:underline inline-flex items-center gap-1">
                Open Module <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
          <CreatorCredit />
        </div>
      </div>
    </div>
  );
}
