import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, Sparkles, Download, Save, Plus, Trash2, CheckCircle2,
  AlertCircle, ChevronRight, Eye, Layout, ShieldCheck, Check
} from 'lucide-react';

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'education' | 'projects' | 'experience' | 'skills'
  const [template, setTemplate] = useState('modern'); // 'modern' | 'classic' | 'minimal' | 'tech'
  const [aiReview, setAiReview] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resumes/my');
      if (res.data.success) {
        setResume(res.data.resume);
        if (res.data.resume.template) setTemplate(res.data.resume.template);
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { ...resume, template };
      const res = await api.post('/resumes', payload);
      if (res.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRunAiReview = async () => {
    try {
      setReviewing(true);
      const res = await api.post('/resumes/review', {
        resumeData: resume,
        targetRole: resume.targetRole || 'Software Engineer'
      });
      if (res.data.success) {
        setAiReview(res.data.analysis);
        setShowReviewModal(true);
      }
    } catch (err) {
      console.error('AI review failed:', err);
    } finally {
      setReviewing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Field helpers
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: 'New Technical Project', techStack: ['React', 'Node.js'], description: '', liveUrl: '', repoUrl: '', bulletPoints: ['Engineered responsive user interface.'] }
      ]
    }));
  };

  const removeProject = (index) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: 'College / University', degree: 'Bachelor of Technology', fieldOfStudy: 'Computer Science', startYear: '2021', endYear: '2025', grade: '8.0 CGPA' }
      ]
    }));
  };

  if (loading || !resume) {
    return <div className="min-h-screen bg-navy-900 p-8 text-center text-slate-400">Loading Resume Builder...</div>;
  }

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-400" />
              Technical Resume Builder & AI Reviewer
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Build an ATS-optimized software engineering resume with instant keyword validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAiReview}
              disabled={reviewing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              {reviewing ? 'Analyzing...' : 'AI Resume Review'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Resume'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>

        {/* 2-Column Split: Form Editor (Left 5 cols) & Live Preview (Right 7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Editor Form Column */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Template Selector & Target Role */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400">Template Style:</span>
                <div className="flex gap-1.5">
                  {['modern', 'classic', 'minimal', 'tech'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`px-2.5 py-1 rounded capitalize ${
                        template === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Position</label>
                <input
                  type="text"
                  value={resume.targetRole || ''}
                  onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                  placeholder="e.g. Software Development Engineer (SDE-1)"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Form Section Navigation */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 p-1 rounded-xl text-xs font-semibold">
              {[
                { id: 'personal', label: 'Contact' },
                { id: 'education', label: 'Education' },
                { id: 'projects', label: 'Projects' },
                { id: 'skills', label: 'Skills' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 text-center rounded-lg transition ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Section Form Panels */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 max-h-[580px] overflow-y-auto">
              
              {activeTab === 'personal' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={resume.personalInfo?.email || ''}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.phone || ''}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.github || ''}
                        onChange={(e) => updatePersonalInfo('github', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={resume.personalInfo?.linkedin || ''}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Professional Summary</label>
                    <textarea
                      rows={4}
                      value={resume.personalInfo?.summary || ''}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  {(resume.education || []).map((edu, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-300">
                        <span>Institution #{idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={edu.institution}
                        placeholder="College Name"
                        onChange={(e) => {
                          const newEdu = [...resume.education];
                          newEdu[idx].institution = e.target.value;
                          setResume({ ...resume, education: newEdu });
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={edu.degree}
                          placeholder="Degree (e.g. B.Tech)"
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].degree = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                        />
                        <input
                          type="text"
                          value={edu.grade}
                          placeholder="CGPA / Percentage"
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].grade = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  {(resume.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">Project #{idx + 1}</span>
                        <button onClick={() => removeProject(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={proj.title}
                        placeholder="Project Title"
                        onChange={(e) => {
                          const newP = [...resume.projects];
                          newP[idx].title = e.target.value;
                          setResume({ ...resume, projects: newP });
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                      <input
                        type="text"
                        value={(proj.techStack || []).join(', ')}
                        placeholder="Technologies (comma-separated, e.g. React, Node.js, Redis)"
                        onChange={(e) => {
                          const newP = [...resume.projects];
                          newP[idx].techStack = e.target.value.split(',').map(s => s.trim());
                          setResume({ ...resume, projects: newP });
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                      <textarea
                        rows={3}
                        value={(proj.bulletPoints || []).join('\n')}
                        placeholder="Action-oriented bullet points (one per line)..."
                        onChange={(e) => {
                          const newP = [...resume.projects];
                          newP[idx].bulletPoints = e.target.value.split('\n');
                          setResume({ ...resume, projects: newP });
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addProject}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Technical Project
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  {(resume.skills || []).map((sk, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <input
                        type="text"
                        value={sk.category}
                        placeholder="Category (e.g. Programming Languages)"
                        onChange={(e) => {
                          const newS = [...resume.skills];
                          newS[idx].category = e.target.value;
                          setResume({ ...resume, skills: newS });
                        }}
                        className="w-full p-2 font-semibold rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                      <input
                        type="text"
                        value={(sk.items || []).join(', ')}
                        placeholder="Items (comma-separated)"
                        onChange={(e) => {
                          const newS = [...resume.skills];
                          newS[idx].items = e.target.value.split(',').map(s => s.trim());
                          setResume({ ...resume, skills: newS });
                        }}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Live Formatted Resume Preview Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 min-h-[700px] text-xs font-sans space-y-5 print:p-0 print:shadow-none print:border-none print:rounded-none">
              
              {/* Header Contact */}
              <div className="text-center space-y-1.5 pb-4 border-b border-slate-300">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                  {resume.personalInfo?.fullName || 'Full Name'}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 text-[11px]">
                  {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
                  {resume.personalInfo?.phone && <span>• {resume.personalInfo.phone}</span>}
                  {resume.personalInfo?.github && <span>• {resume.personalInfo.github}</span>}
                  {resume.personalInfo?.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.personalInfo?.summary && (
                <div className="space-y-1">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                    Professional Summary
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-[11.5px]">
                    {resume.personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Technical Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                    Technical Skills
                  </h3>
                  <div className="space-y-1 text-[11.5px]">
                    {resume.skills.map((sk, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-900">{sk.category}: </span>
                        <span className="text-slate-700">{(sk.items || []).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                    Technical Projects
                  </h3>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1 text-[11.5px]">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{proj.title} <span className="font-normal text-slate-600">| {(proj.techStack || []).join(', ')}</span></span>
                      </div>
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-[11px]">
                        {(proj.bulletPoints || []).filter(Boolean).map((bp, bIdx) => (
                          <li key={bIdx}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b border-slate-200 pb-0.5">
                    Education
                  </h3>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11.5px]">
                      <div>
                        <div className="font-bold text-slate-900">{edu.institution}</div>
                        <div className="text-slate-700">{edu.degree} in {edu.fieldOfStudy}</div>
                      </div>
                      <div className="text-right text-slate-600">
                        <div>{edu.startYear} - {edu.endYear}</div>
                        <div className="font-semibold text-slate-800">{edu.grade}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* AI Resume Review Modal */}
        {showReviewModal && aiReview && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">AI ATS Resume Review & Gap Analysis</h3>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
                <div>
                  <div className="text-xs text-purple-300 uppercase font-semibold">Completeness Metric</div>
                  <div className="text-3xl font-extrabold text-white mt-0.5">{aiReview.completenessScore}%</div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  Target Role: <span className="font-bold text-slate-200">{aiReview.targetRole}</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Quality Checklist</h4>
                {aiReview.checklist.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-semibold ${check.passed ? 'text-slate-200' : 'text-yellow-300'}`}>
                        {check.item}
                      </span>
                      {!check.passed && <p className="text-[11px] text-slate-400 mt-0.5">{check.tip}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Strategic Assessment */}
              {aiReview.aiFeedback && (
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1.5 max-h-48 overflow-y-auto">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gemini ATS Intelligence Feedback:
                  </div>
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                    {aiReview.aiFeedback}
                  </div>
                </div>
              )}

              {/* Bullet Suggestion */}
              {aiReview.bulletImprovementSuggestion && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="font-semibold text-purple-400">Action Verb Recommendation:</div>
                  <p className="text-slate-300 leading-relaxed">{aiReview.bulletImprovementSuggestion}</p>
                </div>
              )}

              <button
                onClick={() => setShowReviewModal(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
              >
                Close & Apply Enhancements
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
