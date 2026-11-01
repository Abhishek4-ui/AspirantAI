import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Target, TrendingUp, Award, CheckCircle2, XCircle, AlertTriangle,
  ShieldCheck, BarChart3, ArrowRight, BookOpen, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview')
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        Loading comprehensive performance analytics...
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const topicData = data?.topicPerformance || [];
  const chartTrend = data?.performanceTrend || [];
  const hasHistory = chartTrend.length > 0 || topicData.length > 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Empirical data on your accuracy, syllabus mastery, negative mark deductions, and test pace.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm">
          <div className="text-2xl font-black text-blue-600 dark:text-neon-cyan">
            {metrics.readinessScore !== undefined ? `${metrics.readinessScore}%` : '0%'}
          </div>
          <div className="text-[10px] font-bold uppercase text-slate-500 mt-1">Readiness Index</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.averageAccuracy !== undefined ? `${metrics.averageAccuracy}%` : '0%'}
          </div>
          <div className="text-[10px] font-bold uppercase text-slate-500 mt-1">Average Accuracy</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-sm">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.totalCorrect || 0}
          </div>
          <div className="text-[10px] font-bold uppercase text-slate-500 mt-1">Total Correct Answers</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-red-500/20 bg-red-50/50 dark:bg-red-950/10 shadow-sm">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {metrics.totalWrong || 0}
          </div>
          <div className="text-[10px] font-bold uppercase text-slate-500 mt-1">Negative Penalties</div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
          Accuracy Progression Trend
        </h3>

        {chartTrend.length > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTrend}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="quizNumber" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#0066FF" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <BarChart3 className="w-10 h-10 mx-auto text-slate-400" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Test Data Recorded Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your empirical accuracy timeline will generate automatically after your first practice quiz or CBT session.
            </p>
            <div className="pt-2">
              <Link
                to="/daily-quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Start Practice Quiz <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Topic Accuracy Breakdown */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
          Topic-Wise Accuracy & Weak-Spot Detection
        </h3>

        {topicData.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center">
            Complete daily quizzes across syllabus subjects to populate your weak-spot diagnostics.
          </div>
        ) : (
          <div className="space-y-3">
            {topicData.map((tp) => (
              <div
                key={tp.topic}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{tp.topic}</span>
                  <span className="text-[11px] text-slate-500">{tp.total} questions attempted</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tp.status === 'Strong'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                  }`}>
                    {tp.status}
                  </span>
                  <span className="text-sm font-black text-blue-600 dark:text-neon-cyan">{tp.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transparent Methodology Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <span>
          AspirantAI uses transparent mathematical formulas derived exclusively from your actual recorded test responses. Readiness scores indicate conceptual syllabus consistency and never fabricate guaranteed examination rankings.
        </span>
      </div>
    </div>
  );
}
