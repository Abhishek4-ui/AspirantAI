import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Database, Play, RefreshCw, CheckCircle2, AlertCircle, Clock,
  Table, HelpCircle, Sparkles, ChevronRight
} from 'lucide-react';

export default function SqlPracticePage() {
  const [lessons, setLessons] = useState([]);
  const [schemaTables, setSchemaTables] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [query, setQuery] = useState('SELECT first_name, last_name, salary FROM employees WHERE salary > 1200000;');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await api.get('/sql/lessons');
      if (res.data.success) {
        setLessons(res.data.lessons);
        setSchemaTables(res.data.schemaTables);
        if (res.data.lessons.length > 0) {
          selectLesson(res.data.lessons[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load SQL curriculum:', err);
    }
  };

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setQuery(lesson.starterQuery);
    setResult(null);
    setError('');
  };

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    try {
      setRunning(true);
      setError('');
      setResult(null);
      const res = await api.post('/sql/execute', { query });
      if (res.data.success) {
        setResult(res.data);
      } else {
        setError(res.data.error || 'SQL statement execution failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Execution error.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">SQL Practice Workspace</h1>
              <p className="text-xs md:text-sm text-slate-400">
                Isolated in-memory SQLite sandbox with authentic relational schema evaluation.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunQuery}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs md:text-sm font-semibold transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-green-400 fill-green-400" />}
            Execute SQL Query
          </button>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Lessons & Database Schema (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Lessons Selector */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Curriculum Lessons & Problems
              </h3>
              <div className="space-y-1.5">
                {lessons.map(l => (
                  <button
                    key={l.id}
                    onClick={() => selectLesson(l)}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition ${
                      selectedLesson?.id === l.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.title}</span>
                    <span className="text-[10px] opacity-75">{l.difficulty}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Relational Schema Explorer */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-blue-400" />
                Sandbox Schema Tables
              </h3>
              <div className="space-y-3 text-xs">
                {schemaTables.map(st => (
                  <div key={st.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="font-bold text-blue-300 font-mono">{st.name}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {st.columns.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: SQL Query Editor & Tabular Results (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Task Info */}
            {selectedLesson && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">{selectedLesson.practiceTask}</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{selectedLesson.explanation}</p>
              </div>
            )}

            {/* SQL Editor Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                <span>SQL Query Editor</span>
                <span>Isolated SQLite In-Memory Sandbox</span>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-green-300 focus:outline-none focus:border-blue-500 shadow-xl"
                placeholder="Write SQL statement..."
              />
            </div>

            {/* Query Results / Output Console */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 min-h-[300px]">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Query Results
                </span>
                {result && (
                  <span className="text-slate-400 flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {result.executionTimeMs} ms</span>
                    <span>{result.rowCount} Rows returned</span>
                  </span>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    SQL Execution Error:
                  </div>
                  {error}
                </div>
              )}

              {result && result.columns && result.columns.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-200 border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800">
                        {result.columns.map(col => (
                          <th key={col} className="p-2.5 font-mono text-purple-300 uppercase font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {result.values.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-slate-300">
                              {cell === null ? <span className="text-slate-600 italic">NULL</span> : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!result && !error && !running && (
                <div className="text-center py-16 text-slate-500 text-xs italic">
                  Write or modify the SQL query and press "Execute SQL Query" to observe live relational outputs.
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
