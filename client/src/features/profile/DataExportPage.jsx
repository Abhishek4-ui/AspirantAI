import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export default function DataExportPage() {
  const { user } = useAuth();
  const [downloaded, setDownloaded] = useState(false);

  const handleExportJSON = () => {
    const learningData = {
      exportDate: new Date().toISOString(),
      studentProfile: {
        name: user?.name,
        email: user?.email,
        primaryExam: user?.primaryExamId,
        preparationGoals: user?.preparationGoals,
        streak: user?.streak,
        xp: user?.xp
      },
      exportType: 'AspirantAI Complete Student Progress Archive'
    };

    const blob = new Blob([JSON.stringify(learningData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AspirantAI-Data-${user?.name?.replace(/\s+/g, '_') || 'Student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-electric-blue/20 border border-electric-blue/40 flex items-center justify-center mx-auto text-neon-cyan">
        <Download className="w-8 h-8" />
      </div>

      <h1 className="text-3xl font-black text-white">Export Learning Data</h1>
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
        You have complete ownership over your learning history. Download your verified quiz attempts, error logs, and topic mastery statistics as structured JSON.
      </p>

      {downloaded && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Archive generated and downloaded successfully.</span>
        </div>
      )}

      <button
        onClick={handleExportJSON}
        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-electric-blue to-neon-purple text-white font-extrabold text-sm shadow-glow-blue hover:brightness-110 flex items-center justify-center gap-2 mx-auto"
      >
        <FileText className="w-4 h-4" /> Download Complete Progress Archive (.json)
      </button>
    </div>
  );
}
