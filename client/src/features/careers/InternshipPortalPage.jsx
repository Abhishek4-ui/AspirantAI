import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Search, Filter, ExternalLink, Bookmark, Check,
  Calendar, MapPin, DollarSign, Clock, ShieldCheck, Sparkles, Building
} from 'lucide-react';

const DOMAINS = [
  'All', 'Software Development', 'Frontend Development', 'Backend Development',
  'Full-Stack Development', 'AI/ML', 'Data Science', 'Data Analytics',
  'Generative AI', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Mobile Development',
  'Research Internships'
];

export default function InternshipPortalPage() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedWorkType, setSelectedWorkType] = useState('All');
  const [selectedCompensation, setSelectedCompensation] = useState('All');
  const [trackedIds, setTrackedIds] = useState(new Set());
  const [trackMessage, setTrackMessage] = useState('');

  useEffect(() => {
    fetchInternships();
  }, [selectedDomain, selectedWorkType, selectedCompensation]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/internships', {
        params: {
          domain: selectedDomain !== 'All' ? selectedDomain : undefined,
          workType: selectedWorkType !== 'All' ? selectedWorkType : undefined,
          compensationType: selectedCompensation !== 'All' ? selectedCompensation : undefined,
          search: search || undefined
        }
      });
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackApplication = async (internship) => {
    try {
      const res = await api.post('/applications', {
        listingType: 'internship',
        listingId: internship._id,
        title: internship.title,
        company: internship.company,
        status: 'Preparing to Apply',
        deadline: internship.applicationDeadline,
        officialUrl: internship.officialUrl,
        notes: `Stipend: ${internship.stipend} | Location: ${internship.location}`
      });
      if (res.data.success) {
        setTrackedIds(prev => new Set([...prev, internship._id]));
        setTrackMessage(`Added "${internship.title}" to your Application Tracker!`);
        setTimeout(() => setTrackMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to track internship:', err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-purple-900/40 to-navy-950 p-8 md:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              100% Verified Official Opportunities
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              AspirantAI Dedicated Internship Portal
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Explore authentic internships across software development, AI/ML, cloud, and scientific research. Every listing is verified from official career portals with authentic application links.
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
                onKeyDown={(e) => e.key === 'Enter' && fetchInternships()}
                placeholder="Search by role, company, or tech stack (e.g. React, Python, ISRO)..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={fetchInternships}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
            >
              Search Listings
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Domain:</span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Work Type:</span>
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Compensation:</span>
              <select
                value={selectedCompensation}
                onChange={(e) => setSelectedCompensation(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="paid">Paid Only</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading verified internships...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            No internships match your current filters. Try expanding your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((item) => (
              <div
                key={item._id}
                className="flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 hover:border-slate-700 transition shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.domain}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 leading-snug">{item.title}</h3>
                    <p className="text-sm font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {item.company}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description || item.eligibility}
                </p>

                {/* Meta Attributes */}
                <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Stipend:</span>
                    <span className="font-semibold text-green-400">{item.stipend}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration:</span>
                    <span>{item.duration} ({item.workType})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location:</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline:</span>
                    <span className="text-purple-300">{new Date(item.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Skills tags */}
                {item.requiredSkills && item.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.requiredSkills.slice(0, 4).map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 mt-auto flex items-center gap-2">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                  >
                    Apply on Official Site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleTrackApplication(item)}
                    disabled={trackedIds.has(item._id)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition disabled:opacity-50"
                    title="Add to Application Tracker"
                  >
                    {trackedIds.has(item._id) ? <Check className="w-4 h-4 text-green-400" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 text-center">
                  Source: {item.source}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
