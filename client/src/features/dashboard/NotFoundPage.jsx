import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="bg-white dark:bg-navy-900 max-w-md w-full rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="text-6xl font-black text-blue-600 dark:text-neon-cyan">404</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          The study section or resource URL you are attempting to visit does not exist or has been relocated.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Return to AspirantAI Home
          </Link>
        </div>
      </div>
    </div>
  );
}
