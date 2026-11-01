import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FolderGit2, Github, ExternalLink, Code2, Layers, CheckCircle,
  Sparkles, Terminal, ChevronRight, User, Star, GitFork
} from 'lucide-react';

export default function ProjectLabPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'developer'
  
  // Developer profile state
  const [githubUsername, setGithubUsername] = useState(user?.developerProfile?.githubUsername || '');
  const [bio, setBio] = useState(user?.developerProfile?.bio || '');
  const [devData, setDevData] = useState(null);
  const [loadingDev, setLoadingDev] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');

  useEffect(() => {
    fetchProjects();
    if (user?.developerProfile?.githubUsername) {
      loadDeveloper(user.developerProfile.githubUsername);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      if (res.data.success && res.data.projects.length > 0) {
        setProjects(res.data.projects);
        setSelectedProject(res.data.projects[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDeveloper = async (username) => {
    if (!username) return;
    try {
      setLoadingDev(true);
      const res = await api.get(`/projects/developer/${username}`);
      if (res.data.success) {
        setDevData(res.data.user);
      }
    } catch (err) {
      console.error('Failed to load developer:', err);
    } finally {
      setLoadingDev(false);
    }
  };

  const handleSaveDeveloperProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/projects/developer/me', {
        githubUsername,
        bio
      });
      if (res.data.success) {
        setSavedStatus('Developer profile updated!');
        loadDeveloper(githubUsername);
        setTimeout(() => setSavedStatus(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save developer profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <FolderGit2 className="w-8 h-8 text-blue-400" />
              Project Lab & Developer Portfolio
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Production-oriented architectural project guides and verified public developer showcases.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'projects' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Curated Project Lab
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'developer' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Developer Profile & GitHub
            </button>
          </div>
        </div>

        {/* Tab 1: Curated Project Lab */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Projects List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Engineering Projects ({projects.length})
              </h3>
              {projects.map(p => (
                <div
                  key={p.slug}
                  onClick={() => setSelectedProject(p)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                    selectedProject?.slug === p.slug
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {p.domain}
                    </span>
                    <span className="text-slate-500">{p.difficulty}</span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug">{p.title}</h4>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Project Implementation Guide (8 cols) */}
            <div className="lg:col-span-8">
              {selectedProject && (
                <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-2xl">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {selectedProject.domain} • {selectedProject.difficulty}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-2">{selectedProject.title}</h2>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Prerequisites & Tech Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Prerequisites:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {selectedProject.prerequisites.map((pr, i) => <li key={i}>{pr}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedProject.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step by Step Implementation */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Architectural Implementation Steps
                    </h3>
                    {selectedProject.stepByStepGuidance.map((step, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center gap-2 font-bold text-sm text-purple-300">
                          <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">
                            {step.stepNumber}
                          </span>
                          {step.title}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{step.description}</p>
                        {step.codeSnippet && (
                          <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-green-300 overflow-x-auto">
                            {step.codeSnippet}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Testing & Deployment Guidance */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-300">Testing & Deployment Instructions:</div>
                    <p className="text-slate-400 leading-relaxed">{selectedProject.testingGuidance}</p>
                    <p className="text-slate-400 leading-relaxed">{selectedProject.deploymentGuidance}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Developer Profile & GitHub Integration */}
        {activeTab === 'developer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Form: Edit Developer Profile (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleSaveDeveloperProfile} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Github className="w-5 h-5 text-purple-400" />
                  Connect Public GitHub
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your genuine GitHub username. The platform fetches your live public repositories and commits via the official GitHub API.
                </p>

                {savedStatus && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-semibold">
                    {savedStatus}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. torvalds or yourhandle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Developer Biography</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief intro on your favorite tech stack and engineering aspirations..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Sync & Update Profile'}
                </button>
              </form>
            </div>

            {/* Right Display: Live GitHub Repositories (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Verified Public Repositories</span>
                  {devData?.githubData?.profile && (
                    <span className="text-xs font-normal text-slate-400">
                      Followers: {devData.githubData.profile.followers} • Public Repos: {devData.githubData.profile.public_repos}
                    </span>
                  )}
                </h3>

                {loadingDev && <div className="text-center py-12 text-slate-400 text-xs">Querying GitHub API...</div>}

                {!loadingDev && (!devData?.githubData?.publicRepos || devData.githubData.publicRepos.length === 0) && (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    {devData?.githubData?.error || 'Enter a valid GitHub username to pull genuine live repositories.'}
                  </div>
                )}

                {!loadingDev && devData?.githubData?.publicRepos && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {devData.githubData.publicRepos.map((repo, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-300 truncate">{repo.name}</span>
                            <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">
                            {repo.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                          {repo.language && <span className="text-purple-300">{repo.language}</span>}
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stars}</span>
                          <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
