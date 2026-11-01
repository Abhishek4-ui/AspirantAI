import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, BookOpen, Layers, BookMarked, ArrowRight } from 'lucide-react';

export default function RevisionCenterPage() {
  const revisionModules = [
    { title: 'SuperMemo Flashcards', desc: 'Formulas and definitions due for review', path: '/flashcards', icon: '🗂️' },
    { title: 'AI Mistake Notebook', desc: 'Revise incorrect questions from past mock tests', path: '/mistake-notebook', icon: '📓' },
    { title: 'Formula Compendium', desc: 'Class 10 & 12 board formulas & identities', path: '/boards/class-10', icon: '📐' },
    { title: 'Custom Quick Quiz', desc: 'Generate 10 rapid questions from weak topics', path: '/paper-generator', icon: '⚡' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Smart Revision Center</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">Targeted revision tools to convert weak topics into scoring strengths.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revisionModules.map((m) => (
          <Link
            key={m.title}
            to={m.path}
            className="glass-panel glass-panel-hover rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{m.icon}</span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-neon-cyan transition-colors">{m.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.desc}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
