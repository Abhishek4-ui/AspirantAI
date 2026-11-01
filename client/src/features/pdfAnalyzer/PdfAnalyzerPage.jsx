import React, { useState } from 'react';
import api from '../../services/api';
import { FileText, Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PdfAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append('pdf', file);

      const res = await api.post('/ai-services/pdf-analyzer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setAnalysis(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <FileText className="w-3.5 h-3.5" /> Study Material Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">PDF Material Analyzer</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Upload any official coaching notes, standard reference documents, or magazines. Extract key concepts and auto-generate practice MCQs.
        </p>
      </div>

      <form onSubmit={handleUploadAndAnalyze} className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-6">
        <div className="border-2 border-dashed border-slate-700 hover:border-neon-cyan rounded-2xl p-8 transition-colors cursor-pointer relative bg-navy-900/40">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-neon-cyan mx-auto mb-2" />
          <p className="text-xs text-white font-bold">
            {file ? file.name : 'Select or drop your PDF document'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">PDF documents up to 20MB</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Synthesizing PDF Content...' : 'Analyze PDF & Extract Practice Questions'}
        </button>
      </form>

      {analysis && (
        <div className="glass-panel rounded-3xl p-8 border border-electric-blue/40 space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">Analysis Summary</span>
              <span className="text-xs text-slate-400">{analysis.pagesProcessed} Pages Analyzed</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">{analysis.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted High-Yield Concepts</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysis.extractedKeyConcepts?.map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 text-xs">
                  <div className="font-bold text-white mb-0.5">{item.article}: {item.topic}</div>
                  <div className="text-[11px] text-neon-cyan font-semibold">{item.importance}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Generated Test Questions</h4>
            <div className="space-y-3">
              {analysis.generatedPracticeQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white">Q. {q.question}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt, i) => (
                      <div key={i} className="p-2 rounded-lg bg-navy-800 text-slate-300">
                        {opt}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-emerald-400 font-bold pt-1">
                    Correct Answer: {q.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
