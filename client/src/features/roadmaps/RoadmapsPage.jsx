import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Compass, CheckCircle2, Circle, ArrowRight, Award, Sparkles,
  BookOpen, Code, Database, Cpu, Layers
} from 'lucide-react';

export default function RoadmapsPage() {
  const { user } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState('web-dev');
  const [trackDetail, setTrackDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [xpMessage, setXpMessage] = useState('');

  const tracks = [
    { id: 'web-dev', title: 'Full-Stack Web Development', icon: Code },
    { id: 'dsa', title: 'Data Structures & Algorithms', icon: Layers },
    { id: 'ai-ml', title: 'AI, ML & Data Science', icon: Cpu },
    { id: 'gate-cse', title: 'GATE Computer Science', icon: BookOpen }
  ];

  useEffect(() => {
    fetchTrack(selectedTrack);
  }, [selectedTrack]);

  const fetchTrack = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/learning-tracks/${id}`);
      if (res.data.success) {
        setTrackDetail(res.data.track);
      }
    } catch (err) {
      console.error('Failed to load roadmap track:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMilestone = async (stepNumber, title) => {
    try {
      const res = await api.post(`/learning-tracks/${selectedTrack}/progress`, {
        milestoneId: `step-${stepNumber}`
      });
      if (res.data.success) {
        setCompletedSteps(prev => new Set([...prev, stepNumber]));
        setXpMessage(`Milestone "${title}" marked complete! +20 XP awarded.`);
        setTimeout(() => setXpMessage(''), 4000);
      }
    } catch (err) {
      console.error('Progress update failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Structured Engineering & Career Roadmaps</h1>
              <p className="text-sm text-slate-400 mt-1">
                Ordered learning milestones from core foundations to advanced production mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Track Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tracks.map(t => {
            const Icon = t.icon;
            const isSelected = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold leading-snug">{t.title}</span>
              </button>
            );
          })}
        </div>

        {xpMessage && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            {xpMessage}
          </div>
        )}

        {/* Roadmap Milestones Timeline */}
        {loading || !trackDetail ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading roadmap milestones...</div>
        ) : (
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{trackDetail.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{trackDetail.description}</p>
            </div>

            <div className="space-y-4 pt-4">
              {(trackDetail.milestones || []).map((m, idx) => {
                const isCompleted = completedSteps.has(m.step);
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}>
                        {m.step}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{m.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteMilestone(m.step, m.title)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4" />}
                      {isCompleted ? 'Completed' : 'Mark Done (+20 XP)'}
                    </button>
                  </div>
                );
              })}

              {/* In case of topics array like DSA */}
              {(trackDetail.topics || []).map((t, idx) => {
                const isCompleted = completedSteps.has(idx + 1);
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-green-500/5 border-green-500/30'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{t.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Recommended structured lessons & practice problems</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteMilestone(idx + 1, t.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4" />}
                      {isCompleted ? 'Mastered' : 'Mark Done (+20 XP)'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
