import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Cpu, Target, Award, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

export default function StudyCoachPage() {
  const { user } = useAuth();
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/ai-services/study-coach', {}).then(res => {
      if (res.data.success) {
        setCoachData(res.data.coachInsights);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-xs font-bold mb-3 shadow-glow-purple">
          <Cpu className="w-3.5 h-3.5" /> Adaptive Diagnostic Coach
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">AI Study Coach</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          Real-time strategic analysis of your speed, syllabus completion, and topic retention.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Synthesizing personalized coach insights...</div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-electric-blue/30 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">Coach Diagnostic Status</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 dark:border-emerald-500/40 px-3 py-1 rounded-full">
                {coachData?.readinessLevel}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-electric-blue/15 border border-blue-200 dark:border-electric-blue/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <strong className="text-slate-900 dark:text-white block mb-1">Coach Strategy Recommendation:</strong>
              {coachData?.smartTip}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Priority Focus Areas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coachData?.priorityFocusAreas?.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">{item.subject}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
