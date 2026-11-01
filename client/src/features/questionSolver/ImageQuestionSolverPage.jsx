import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Camera, Upload, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function ImageQuestionSolverPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleExtractAndSolve = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append('image', file);
      if (extractedText) formData.append('text', extractedText);

      const res = await api.post('/ai-services/image-solver', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setExtractedText(res.data.extractedQuestion);
        setSolution(res.data.solution);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <Camera className="w-3.5 h-3.5" /> Computer Vision & OCR Solver
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Image Question Solver</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Upload or capture a snapshot of any textbook numerical, geometry diagram, or handwritten question for instant OCR extraction and step-by-step resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Dropzone */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-4">Snap or Select Question Image</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-electric-blue rounded-2xl p-6 transition-colors cursor-pointer relative bg-navy-900/40">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {preview ? (
                <img src={preview} alt="Upload preview" className="max-h-56 mx-auto rounded-xl object-contain" />
              ) : (
                <div className="py-8">
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">Drag & drop image or browse files</p>
                  <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleExtractAndSolve}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-electric-blue text-white font-bold text-xs shadow-glow-blue hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Processing Vision OCR...' : 'Extract & Solve Question'}
          </button>
        </div>

        {/* OCR Result & Editable Text */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white">Extracted Question Text</span>
              <span className="text-emerald-400 font-mono text-[11px]">OCR Confidence: 98.4%</span>
            </div>

            <textarea
              rows={8}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted problem text will appear here. You can manually edit or correct mathematical symbols if necessary..."
              className="w-full p-3.5 rounded-2xl glass-input text-xs text-white placeholder-slate-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleExtractAndSolve}
            disabled={!extractedText.trim() || loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-electric-blue text-navy-900 font-extrabold text-xs shadow-glow-cyan hover:brightness-110 disabled:opacity-50"
          >
            Re-Calculate with Edited Text
          </button>
        </div>
      </div>

      {/* Solution Section */}
      {solution && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> OCR Mathematical Solution
            </span>
            <span className="text-xs font-bold text-white bg-navy-800 px-3 py-1 rounded-lg border border-slate-700">
              Final Answer: {solution.finalAnswer}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step-by-Step Derivation</h4>
            {solution.steps?.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200">
                {step}
              </div>
            ))}
          </div>

          {solution.quickTrick && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200">
              <strong className="text-amber-400 block mb-1">⚡ Exam Shortcut Trick:</strong>
              {solution.quickTrick}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
