import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen, ExternalLink, ShieldCheck, ArrowLeft,
  Calendar, Layers, CheckCircle2, Target
} from 'lucide-react';

export default function ExamDetailsPage() {
  const { code } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/exams/${code}`).then(res => {
      if (res.data.success) {
        setExam(res.data.exam);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading exam blueprint...</div>;
  }

  if (!exam) {
    return <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Exam profile not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      <Link to="/exams" className="text-xs text-electric-blue dark:text-neon-cyan hover:underline inline-flex items-center gap-1.5">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Exam Directory
      </Link>

      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-electric-blue/30 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-electric-blue dark:text-neon-cyan border border-slate-200 dark:border-slate-700">
              {exam.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">{exam.title}</h1>
            {exam.hindiTitle && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{exam.hindiTitle}</p>}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Authority: <strong className="text-slate-800 dark:text-slate-200">{exam.conductingAuthority}</strong></p>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/cbt-simulator?examCode=${exam.code}`}
              className="px-5 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
            >
              Practice {exam.code.replace('_', ' ')} CBT Mock Test
            </Link>
            {exam.officialNotificationUrl && (
              <a
                href={exam.officialNotificationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:text-white inline-flex items-center gap-1"
              >
                Official Notification <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">Eligibility & Qualification</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{exam.qualification}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">Age Limits</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{exam.ageLimits?.min} - {exam.ageLimits?.max} Years ({exam.ageLimits?.relaxationDetails || 'Standard relaxations'})</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">Negative Marking</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{exam.examPattern?.negativeMarking?.fraction || 'Applicable as per official scheme'}</p>
          </div>
        </div>
      </div>

      {/* Examination Stages & Pattern */}
      {exam.examPattern?.stages?.length > 0 && (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-electric-blue dark:text-neon-cyan" /> Exam Stages & Pattern
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {exam.examPattern.stages.map((stage) => (
              <div key={stage.stageName} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-electric-blue dark:text-neon-cyan block mb-1">{stage.mode}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{stage.stageName}</h3>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total Marks: <strong className="text-slate-800 dark:text-slate-200">{stage.totalMarks}</strong></div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Duration: <strong className="text-slate-800 dark:text-slate-200">{stage.duration}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
