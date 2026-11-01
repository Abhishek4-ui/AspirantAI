import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import api from '../../services/api';
import {
  Sparkles, Code, Bug, Wrench, RefreshCw, Copy, Check,
  Terminal, ShieldCheck, Cpu, ArrowRight
} from 'lucide-react';

const DEFAULT_SAMPLE_CODE = `// Example: Binary Search with subtle bug
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length; // Notice potential index out-of-bounds
  
  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid; // Potential infinite loop bug
    } else {
      right = mid;
    }
  }
  return -1;
}`;

export default function AiCodingAssistantPage() {
  const [code, setCode] = useState(DEFAULT_SAMPLE_CODE);
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('debug'); // 'explain' | 'debug' | 'refactor' | 'generate_tests'
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      const res = await api.post('/ai-services/coding-assistant', {
        code,
        language,
        mode,
        prompt: userPrompt
      });
      if (res.data.success) {
        setResponse(res.data);
      }
    } catch (err) {
      setResponse({
        explanation: 'AI service request failed. Please check network connectivity or server logs.',
        suggestedCode: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Coding Assistant & Debugger</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Intelligent code analysis, automated debugging, and test generation</p>
            </div>
          </div>

          {/* Mode Pill Selectors */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
            {[
              { id: 'explain', label: 'Explain Code', icon: Code },
              { id: 'debug', label: 'Debug & Fix Bugs', icon: Bug },
              { id: 'refactor', label: 'Clean Refactor', icon: Wrench },
              { id: 'generate_tests', label: 'Generate Tests', icon: ShieldCheck }
            ].map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium ${
                    mode === m.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Monaco Code Input (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Input Source Code:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold transition shadow disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Analyze Code
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <Editor
                height="100%"
                language={language === 'c' || language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(newVal) => setCode(newVal || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>

            {/* Custom Instruction Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Custom Instruction or Error Message (Optional):
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. 'Fix the infinite loop' or 'Optimize from O(N^2) to O(N)'..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right Column: AI Analysis & Output (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                AI Analysis Panel
              </span>
              {response?.providerName && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {response.providerName}
                </span>
              )}
            </div>

            <div className="h-[520px] rounded-2xl bg-slate-950/80 border border-slate-800 p-5 overflow-y-auto space-y-4 font-sans text-sm text-slate-200">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full space-y-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-sm">Synthesizing syntax trees and analyzing complexity...</p>
                </div>
              )}

              {!loading && !response && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 space-y-2">
                  <Sparkles className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                  <p className="font-medium text-slate-400">Your AI Engineering Assistant is Ready</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Paste any code in C, C++, Java, Python, or JavaScript and click Analyze to uncover edge cases and fixes.
                  </p>
                </div>
              )}

              {!loading && response && (
                <div className="space-y-4">
                  <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {response.explanation}
                  </div>

                  {response.suggestedCode && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-purple-400">Suggested Code Solution:</span>
                        <button
                          onClick={() => copyToClipboard(response.suggestedCode)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
                        {response.suggestedCode}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
