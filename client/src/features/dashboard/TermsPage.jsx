import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="text-slate-500 dark:text-slate-400">Effective Date: October 2026</p>

      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Platform Purpose & Information Accuracy</h2>
        <p>AspirantAI provides educational assessments, practice questions, and study assistance. All official notification details are sourced from public gazettes; students must always verify final deadlines with the official conducting authorities.</p>

        <h2 className="text-base font-bold text-white">2. Acceptable Conduct</h2>
        <p>Users must not engage in harassment within study groups or community discussions, attempt to reverse-engineer server-scoring logic, or automate test submissions.</p>
      </div>
    </div>
  );
}
