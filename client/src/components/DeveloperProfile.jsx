import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Sparkles, CheckCircle2, Layers, Cpu, Globe } from 'lucide-react';
import appConfig from '../config/appConfig';

export default function DeveloperProfile() {
  const [imgSrc, setImgSrc] = useState(appConfig.CREATOR_PHOTO);

  const handleImageError = () => {
    if (imgSrc !== appConfig.CREATOR_PHOTO_FALLBACK) {
      setImgSrc(appConfig.CREATOR_PHOTO_FALLBACK);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-200 dark:border-electric-blue/30 shadow-xl dark:shadow-2xl"
      >
        {/* Ambient lighting glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-electric-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-neon-purple/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* 3D Profile Card Photo Container */}
          <motion.div
            whileHover={{ scale: 1.03, rotateY: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl p-1 bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-600 shadow-lg dark:shadow-glow-blue flex-shrink-0 relative group"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-navy-800 relative">
              <img
                src={imgSrc}
                alt="Abhishek Kumar, MERN Stack Developer"
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-navy-900/60 via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white dark:bg-navy-900 border border-blue-500 dark:border-neon-cyan rounded-full px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-neon-cyan flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-neon-cyan" /> Full Stack
            </div>
          </motion.div>

          {/* Details & Bio */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-neon-cyan text-xs font-semibold mb-3">
              <Code2 className="w-3.5 h-3.5" /> Lead Architect & Creator
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {appConfig.CREATOR_NAME}
            </h1>

            <div className="text-lg font-semibold text-blue-600 dark:text-cyan-400 mt-1">
              {appConfig.CREATOR_ROLE}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Architected the full AspirantAI ecosystem from scratch, unifying all 30 GATE engineering disciplines, UPSC, State PSCs, server-authoritative CBT mock engines, and real-time AI doubt resolution into a unified, high-performance platform.
            </p>

            {/* Quick Skills Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-5">
              {[
                'React 18 & Vite',
                'Node.js & Express',
                'MongoDB & Mongoose',
                'Tailwind CSS & Framer Motion',
                'Google Gemini AI API',
                '3D Three.js & Lucide'
              ].map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Contact / Portfolio Link */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href={appConfig.CREATOR_LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" /> Connect on LinkedIn
              </a>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Location: {appConfig.CREATOR_LOCATION}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
