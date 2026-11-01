import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, Sparkles, Save, Download, Copy, Check, Search,
  Folder, Trash2, Edit3, BookOpen, Globe
} from 'lucide-react';

export default function AiNotesPage() {
  const { user, language: appLang } = useAuth();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [examCategory, setExamCategory] = useState('GATE & Tech Placements');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [lang, setLang] = useState(appLang || 'en');
  const [format, setFormat] = useState('detailed_summary');
  const [generating, setGenerating] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSavedNotes();
  }, []);

  const fetchSavedNotes = async () => {
    try {
      const res = await api.get('/notes');
      if (res.data.success) {
        setSavedNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setGenerating(true);
      const res = await api.post('/notes/generate', {
        topic,
        subject,
        examCategory,
        difficulty,
        language: lang,
        format
      });
      if (res.data.success) {
        setCurrentNote(res.data.note);
      }
    } catch (err) {
      console.error('Note generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentNote) return;
    try {
      const res = await api.post('/notes', currentNote);
      if (res.data.success) {
        setSaveStatus('Note saved to notebook!');
        fetchSavedNotes();
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchSavedNotes();
      if (currentNote?._id === id) setCurrentNote(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const copyToClipboard = () => {
    if (!currentNote) return;
    navigator.clipboard.writeText(currentNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredNotes = savedNotes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">AI Study Notes Generator</h1>
              <p className="text-sm text-slate-400">
                Generate structured, high-yield revision notes in English & Hindi with automatic formula sheets.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Generator Form & Saved Notes (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Generator Form */}
            <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Notes Configuration
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Dynamic Programming, Fundamental Rights..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? 'Synthesizing Notes...' : 'Generate Structured Notes'}
              </button>
            </form>

            {/* Saved Notes Drawer */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-blue-400" />
                  My Saved Notebook ({savedNotes.length})
                </h3>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved notes..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No saved notes found.</p>
                ) : (
                  filteredNotes.map(n => (
                    <div
                      key={n._id}
                      onClick={() => setCurrentNote(n)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                        currentNote?._id === n._id
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold truncate">{n.title}</div>
                        <div className="text-[10px] text-slate-500">{n.subject} • {n.language === 'hi' ? 'हिंदी' : 'EN'}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(n._id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Note Viewer & Action Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Viewer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                Active Note Reader
              </span>

              {currentNote && (
                <div className="flex items-center gap-2">
                  {saveStatus && <span className="text-xs text-green-400 font-semibold">{saveStatus}</span>}

                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Note
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                </div>
              )}
            </div>

            {/* Note Content Display */}
            <div className="min-h-[560px] p-8 rounded-3xl bg-slate-950/90 border border-slate-800 text-slate-200 text-sm overflow-y-auto leading-relaxed shadow-2xl">
              {!currentNote && !generating && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-500 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-slate-600" />
                  <p className="text-base font-semibold text-slate-400">Generate or Select a Note</p>
                  <p className="text-xs max-w-sm text-slate-500">
                    Input a topic in the configuration panel to generate complete definitions, formulas, worked examples, and exam elimination shortcuts.
                  </p>
                </div>
              )}

              {generating && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Synthesizing comprehensive concepts and verified formulas...</p>
                </div>
              )}

              {currentNote && !generating && (
                <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-table:border prose-table:border-slate-800 whitespace-pre-line">
                  {currentNote.content}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
