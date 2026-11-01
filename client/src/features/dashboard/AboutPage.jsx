import React from 'react';
import { Link } from 'react-router-dom';
import appConfig from '../../config/appConfig';
import CreatorCredit from '../../components/CreatorCredit';
import DeveloperProfile from '../../components/DeveloperProfile';
import { Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">About {appConfig.APP_NAME}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          {appConfig.APP_TAGLINE}
        </p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p>
          Every year, millions of determined Indian aspirants prepare for competitive examinations such as UPSC Civil Services, State PSCs (like BPSC & UPPSC), SSC CGL, Railway RRB NTPC, and Banking IBPS/SBI, as well as crucial Class 10th and 12th board exams.
        </p>
        <p>
          Too often, students must juggle fragmented PDF collections, unreliable question answer keys, and static mock platforms lacking modern design or deep adaptive analytics. <strong>AspirantAI</strong> was created by <strong>{appConfig.CREATOR_NAME}</strong> to bridge this gap: uniting 3D visual immersion, verified bilingual question pipelines, server-authoritative scoring, and intelligent revision tools under one roof.
        </p>
      </div>

      {/* Embedded Developer Profile Card */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Creator & Lead Architect</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full-stack engineering & design by {appConfig.CREATOR_NAME}</p>
        </div>
        <DeveloperProfile />
      </div>

      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <CreatorCredit />
      </div>
    </div>
  );
}
