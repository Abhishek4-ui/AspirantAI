import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Sparkles, Code2, Briefcase, Bot, FileText,
  Target, TrendingUp, Users, ShieldCheck, Zap, RefreshCw,
  ArrowRight, CheckCircle2, Terminal, BookOpen, Layers
} from 'lucide-react';

export default function FeaturesSection() {
  const primaryFeatures = [
    {
      id: 'cbt-mock-tests',
      title: 'All-India CBT Mock Tests',
      description: 'Practice official previous year questions and real computer-based mock tests across GATE, UPSC, BPSC, JEE, NEET, SSC, and Banking with real exam timers and negative marking.',
      icon: Award,
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      accentColor: 'from-blue-600/20 to-transparent',
      badge: 'Real Exam Simulation',
      buttonText: 'Explore Mock Tests →',
      link: '/mock-tests'
    },
    {
      id: 'ai-quiz',
      title: 'Start AI Quiz',
      description: 'Generate AI-powered quizzes on any subject or topic with 100-question grand sessions, bilingual explanations, and instant conceptual derivations.',
      icon: Sparkles,
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      accentColor: 'from-emerald-600/20 to-transparent',
      badge: 'Adaptive Intelligence',
      buttonText: 'Start AI Quiz →',
      link: '/daily-quiz'
    },
    {
      id: 'coding-practice',
      title: 'Coding Practice',
      description: 'Solve curated Data Structures & Algorithms challenges in our live sandboxed code editor. Test with custom inputs, calculate Big-O, and track your global rating.',
      icon: Code2,
      iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
      accentColor: 'from-cyan-600/20 to-transparent',
      badge: 'Live Code Sandbox',
      buttonText: 'Start Coding →',
      link: '/coding'
    },
    {
      id: 'apply-internships',
      title: 'Apply for Internships',
      description: 'Find and apply directly to verified software, AI, and research internships. Direct verified corporate links without fake postings or middlemen.',
      icon: Briefcase,
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
      accentColor: 'from-purple-600/20 to-transparent',
      badge: '100% Verified Opportunities',
      buttonText: 'Explore Internships →',
      link: '/internships'
    },
    {
      id: 'ai-interview-prep',
      title: 'AI Interview Prep & Career',
      description: 'Master technical and behavioral interviews with real-time AI coding analysis, ATS resume completeness scoring, and fresher engineer job pipelines.',
      icon: Bot,
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      accentColor: 'from-amber-600/20 to-transparent',
      badge: 'ATS & Interview Coach',
      buttonText: 'Practice Interviews →',
      link: '/resume-builder'
    },
    {
      id: 'ai-youtube-notes',
      title: 'AI YouTube Notes & Docs',
      description: 'Convert technical and competitive exam YouTube lectures into comprehensive bilingual study notes, formula cheat-sheets, and downloadable PDF summaries.',
      icon: FileText,
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
      accentColor: 'from-rose-600/20 to-transparent',
      badge: 'Instant Study Notes',
      buttonText: 'Generate Notes →',
      link: '/ai-notes'
    }
  ];

  const highlights = [
    {
      title: 'Exam Focused',
      description: 'Specially designed for GATE, UPSC, BPSC, SSC, and engineering semester examinations.',
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Track Progress',
      description: 'Detailed analytics and mistake notebooks to monitor your accuracy, percentile, and speed.',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Community Driven',
      description: 'Collaborate with fellow aspirants, share verified notes, and solve doubts together in study groups.',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Quality Content',
      description: 'Expert-verified syllabus, real PYQs with step-by-step solutions, and zero hallucinated keys.',
      icon: ShieldCheck,
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      title: 'Accessible & Open',
      description: 'Comprehensive preparation tools with zero paywalls, open syllabus roadmaps, and full access for serious competitive aspirants.',
      icon: Zap,
      color: 'text-amber-600 dark:text-yellow-400'
    },
    {
      title: 'Regular Updates',
      description: 'Continuous additions of newly notified government vacancies, PYQ papers, and coding tasks.',
      icon: RefreshCw,
      color: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <section id="features" className="relative py-16 lg:py-24 bg-slate-50 dark:bg-[#080D1B] text-slate-900 dark:text-white overflow-hidden scroll-mt-20 transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 dark:bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Comprehensive Learning Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-4">
            Powerful Features for Next-Gen{' '}
            <span className="text-blue-600 dark:text-blue-400">Learning</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need for PYQs, CBT mock tests, coding practice, AI interview prep, bilingual study notes, and verified internships.
          </p>
        </div>

        {/* 6 Primary Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {primaryFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-[32px] p-8 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-gradient-to-br dark:from-slate-900/90 dark:to-navy-950/90 shadow-md dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl hover:border-blue-500/40 transition-all group flex flex-col justify-between"
              >
                {/* Decorative top-right curved shape */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feat.accentColor} rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110`} />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${feat.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 flex-grow">
                    {feat.description}
                  </p>

                  {/* Pill CTA Button */}
                  <Link
                    to={feat.link}
                    className="w-full py-3.5 px-6 rounded-full border-2 border-slate-300 dark:border-white/60 hover:border-blue-600 dark:hover:border-white bg-slate-50 dark:bg-transparent hover:bg-blue-50 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm group-hover:border-blue-600 dark:group-hover:border-cyan-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300"
                  >
                    <span>{feat.buttonText}</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 6 Secondary Trust & Value Highlights */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Why Aspirants Choose Our Platform</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Built with integrity, verified official information, and cutting-edge engineering</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-blue-400/50 dark:hover:border-slate-700 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <HIcon className={`w-5 h-5 ${h.color}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{h.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{h.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
