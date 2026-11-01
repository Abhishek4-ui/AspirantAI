import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Award, BookOpen, Compass, Cpu,
  CheckCircle, ArrowRight, Zap, Target, Layers, Users,
  Code2, Briefcase, FileText, CheckCircle2, ShieldCheck,
  Video, Play
} from 'lucide-react';
import CreatorCredit from '../../components/CreatorCredit';
import FeaturesSection from '../../components/FeaturesSection';
import appConfig from '../../config/appConfig';

export default function LandingPage() {
  const examCategories = [
    {
      title: 'GATE 2026 / 2025 (All 30 Papers)',
      desc: 'Complete official syllabus, verified PYQs, NAT/MSQ questions, and full 65-question timed CBT simulators for CS, DA, EC, EE, ME, CE, and 24 other disciplines.',
      badge: '30 Official Disciplines',
      link: '/gate'
    },
    {
      title: 'UPSC Civil Services & State PSCs',
      desc: 'General Studies Paper 1 & 2 for UPSC IAS/IPS, IFS, CDS, NDA, CAPF, alongside BPSC 70th/71st CCE, UPPSC, MPPSC, RPSC, and JPSC.',
      badge: 'Prelims + Mains',
      link: '/exams'
    },
    {
      title: 'SSC Recruitment Examinations',
      desc: 'CGL Tier 1 & 2, CHSL (10+2), MTS, GD Constable, and CPO with speed calculation timers and official negative marking.',
      badge: 'Tier 1 & Tier 2',
      link: '/exams'
    },
    {
      title: 'Banking & Financial Institutions',
      desc: 'Sectional time limits for IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B, and LIC AAO speed aptitude.',
      badge: 'Sectional Timers',
      link: '/exams'
    },
    {
      title: 'Railway Recruitment Boards',
      desc: 'RRB NTPC Stage 1 & 2, Group D, and Assistant Loco Pilot (ALP) CBT examination simulations with official marking.',
      badge: 'CBT 1 & 2',
      link: '/exams'
    },
    {
      title: 'Engineering & Medical Entrance',
      desc: 'NTA JEE Main, JEE Advanced, and NEET UG (Biology, Chemistry, Physics) with chapter-wise analytics and PYQs.',
      badge: 'JEE Main & NEET',
      link: '/exams'
    },
    {
      title: 'Class 10th & 12th Board Examinations',
      desc: 'Chapter-wise NCERT formulas, concept summaries, and objective question banks for CBSE, BSEB, and ICSE boards.',
      badge: 'Class 10 & 12',
      link: '/boards/class-10'
    },
    {
      title: 'Coding, DSA & Software Engineering',
      desc: 'Live sandboxed code editor, curated LeetCode Blind 75 challenges, SQL query practice, and software internships.',
      badge: 'Monaco Sandbox',
      link: '/coding'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-navy-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Subtle Ambient Glow Overlays */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-neon-cyan text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>All-India Competitive Examination Preparation Platform</span>
          </div>

          {/* Master Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Prepare Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 block sm:inline">
              Practice Better.
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
              Succeed With Confidence.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your personalized platform for 30 GATE engineering branches, UPSC, State PSCs, SSC, Banking, and Board exams. Practice verified official PYQs, full 65-question timed CBT simulators, and sandboxed coding.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/daily-quiz"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Practicing Today</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/gate"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base hover:text-blue-600 dark:hover:text-white hover:border-blue-500 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-blue-600 dark:text-neon-cyan" />
              <span>GATE 30-Paper Hub</span>
            </Link>

            <Link
              to="/exams"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Explore All Exams</span>
            </Link>
          </div>

          <div className="mt-8">
            <CreatorCredit />
          </div>
        </div>
      </section>

      {/* Target Exams Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-neon-cyan">
            Targeted Syllabus Coverage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Syllabus Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real exam patterns, verified syllabi, server-authoritative mock tests, and Class 10/12 board materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {examCategories.map((exam) => (
            <div
              key={exam.title}
              className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-neon-cyan flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {exam.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {exam.desc}
                </p>
              </div>

              <Link
                to={exam.link}
                className="text-xs font-bold text-blue-600 dark:text-neon-cyan inline-flex items-center gap-1 group-hover:underline"
              >
                <span>Access Syllabus & Tests</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Features Section */}
      <FeaturesSection />

      {/* Daily Grand Assessment Spotlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-950/90 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-neon-cyan text-xs font-bold">
                <Zap className="w-3.5 h-3.5" /> Published Daily at Midnight IST
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                All-India Daily 100-Question Grand Quiz
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Build real examination stamina. 100 bilingual questions, interactive navigation palette, server-authoritative timer, negative marking evaluation, and instant topic-wise accuracy breakdown.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/daily-quiz"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Target className="w-4 h-4" /> Attempt Today’s Quiz
                </Link>
                <Link
                  to="/cbt-simulator"
                  className="px-6 py-3 rounded-xl glass-panel border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:text-blue-600 dark:hover:text-white"
                >
                  Launch CBT Simulation
                </Link>
              </div>
            </div>

            {/* Visual Indicator of 100 Questions Palette */}
            <div className="w-full lg:w-96 p-6 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                <span>100-Question Palette</span>
                <span className="text-blue-600 dark:text-neon-cyan">2 Hours • -0.66 Negative</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                      i < 12
                        ? 'bg-emerald-600 text-white'
                        : i < 18
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"/> Answered</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"/> Review</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 inline-block"/> Pending</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
