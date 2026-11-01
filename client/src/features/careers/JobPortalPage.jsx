import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Search, Filter, ExternalLink, Bookmark, Check,
  Calendar, MapPin, DollarSign, Award, Building, Sparkles, UserCheck
} from 'lucide-react';

const CATEGORIES = [
  'All', 'Software Engineer', 'Associate Software Engineer', 'Graduate Engineer Trainee',
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'AI/ML Engineer',
  'Data Analyst', 'QA Engineer', 'Cloud Engineer', 'DevOps Engineer'
];

export default function JobPortalPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArrangement, setSelectedArrangement] = useState('All');
  const [fresherOnly, setFresherOnly] = useState(true);
  const [trackedIds, setTrackedIds] = useState(new Set());
  const [trackMessage, setTrackMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedArrangement, fresherOnly]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs', {
        params: {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          workArrangement: selectedArrangement !== 'All' ? selectedArrangement : undefined,
          fresherOnly: fresherOnly ? 'true' : undefined,
          search: search || undefined
        }
      });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackJob = async (job) => {
    try {
      const res = await api.post('/applications', {
        listingType: 'job',
        listingId: job._id,
        title: job.title,
        company: job.company,
        status: 'Preparing to Apply',
        deadline: job.applicationDeadline,
        officialUrl: job.officialApplyUrl,
        notes: `Salary: ${job.salaryRange} | Location: ${job.location}`
      });
      if (res.data.success) {
        setTrackedIds(prev => new Set([...prev, job._id]));
        setTrackMessage(`Added "${job.title}" at ${job.company} to your Application Tracker!`);
        setTimeout(() => setTrackMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to track job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/50 via-blue-900/40 to-navy-950 p-8 md:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <UserCheck className="w-4 h-4" />
              Fresher & Entry-Level Career Gateway
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Fresher & Graduate Technical Jobs Portal
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Curated verified career opportunities for fresh engineers, graduate trainees, and early-career developers. No fake postings — direct verified links to official corporate career registries.
            </p>
          </div>
        </div>

        {trackMessage && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            {trackMessage}
          </div>
        )}

        {/* Filter Bar */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                placeholder="Search job title, hiring company, or required skill (e.g. Infosys, SDE, React)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={fetchJobs}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition"
            >
              Filter Jobs
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Work Arrangement:</span>
              <select
                value={selectedArrangement}
                onChange={(e) => setSelectedArrangement(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={fresherOnly}
                onChange={(e) => setFresherOnly(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
              />
              <span className="text-slate-300">Fresher Eligible Only (0 - 1 Years)</span>
            </label>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading verified career listings...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            No job opportunities match your active filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 hover:border-slate-700 transition shadow-xl space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {job.category}
                    </span>
                    {job.fresherEligible && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                        Freshers Welcome
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2.5 leading-snug">{job.title}</h3>
                  <p className="text-sm font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {job.description || job.eligibility}
                </p>

                {/* Meta Attributes */}
                <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Package:</span>
                    <span className="font-semibold text-green-400">{job.salaryRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Experience:</span>
                    <span>{job.experienceRequired} ({job.workArrangement})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location:</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline:</span>
                    <span className="text-purple-300">{new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Skills tags */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {job.skillsRequired.slice(0, 4).map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 mt-auto flex items-center gap-2">
                  <a
                    href={job.officialApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                  >
                    Apply on Careers Page
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleTrackJob(job)}
                    disabled={trackedIds.has(job._id)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
                    title="Track in Pipeline"
                  >
                    {trackedIds.has(job._id) ? <Check className="w-4 h-4 text-green-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 text-center">
                  Source: {job.source}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
