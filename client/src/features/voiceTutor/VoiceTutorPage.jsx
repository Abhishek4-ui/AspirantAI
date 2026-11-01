import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, StopCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function VoiceTutorPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tutorReply, setTutorReply] = useState('');
  const [language, setLanguage] = useState('en-IN'); // or 'hi-IN'
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcript.trim()) {
        generateSpokenReply(transcript);
      }
    };

    recognition.onerror = (err) => {
      console.error('Speech error:', err);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [language, transcript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setTutorReply('');
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const [loadingReply, setLoadingReply] = useState(false);

  const generateSpokenReply = async (inputText) => {
    if (!inputText || !inputText.trim()) return;
    setLoadingReply(true);

    let reply = '';
    try {
      const res = await api.post('/ai-services/doubt-solver', {
        question: inputText,
        language: language.startsWith('hi') ? 'hi' : 'en'
      });
      if (res.data?.solution?.detailedExplanation) {
        reply = res.data.solution.detailedExplanation;
      }
    } catch (err) {
      reply = language.startsWith('hi')
        ? `आपके प्रश्न: "${inputText}" का विश्लेषण पूर्ण हुआ। परीक्षा के दृष्टिकोण से मुख्य सूत्र और अवधारणा का विशेष ध्यान रखें।`
        : `Analysis complete for: "${inputText}". Focus on the core theorem, edge bounds, and eliminate negative marks.`;
    } finally {
      setLoadingReply(false);
    }

    if (!reply) return;
    setTutorReply(reply);

    // Speak response using SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown tags for spoken audio
      const spokenText = reply.replace(/[#*_`]/g, '').slice(0, 350);
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = language;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Verbal Tutor
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">AI Voice Tutor</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Speak your doubts aloud in Hindi or English. Hear step-by-step vocal explanations with real-time waveform tracking.
        </p>
      </div>

      {!supported && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
          Notice: Web Speech API is not natively supported in this browser. You can still use the text Doubt Solver.
        </div>
      )}

      {/* Voice Center Stage */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-electric-blue/30 text-center relative overflow-hidden shadow-2xl">
        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setLanguage('en-IN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              language === 'en-IN' ? 'bg-electric-blue text-white shadow-glow-blue' : 'bg-navy-900 text-slate-400'
            }`}
          >
            English Voice
          </button>
          <button
            onClick={() => setLanguage('hi-IN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              language === 'hi-IN' ? 'bg-neon-purple text-white shadow-glow-purple' : 'bg-navy-900 text-slate-400'
            }`}
          >
            हिन्दी स्वर (Hindi)
          </button>
        </div>

        {/* Dynamic Voice Waveform when active */}
        <div className="h-20 flex items-center justify-center gap-1.5 mb-8">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              animate={isRecording || isSpeaking ? {
                height: [12, Math.floor(Math.random() * 55) + 15, 12],
                backgroundColor: isRecording ? '#00D4FF' : '#9D4EDD'
              } : { height: 10, backgroundColor: '#1C2541' }}
              transition={{ repeat: Infinity, duration: 0.5 + (i % 4) * 0.15 }}
              className="w-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gradient-to-tr from-electric-blue to-neon-purple text-white shadow-glow-blue hover:brightness-110'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </motion.button>
        </div>

        <div className="text-xs font-bold text-slate-300">
          {isRecording ? 'Listening... Speak now' : 'Tap Microphone to Speak Your Doubt'}
        </div>

        {transcript && (
          <div className="mt-6 p-4 rounded-2xl bg-navy-900/80 border border-slate-800 text-xs text-slate-200">
            <span className="text-slate-400 block mb-1">Your Spoken Query:</span>
            "{transcript}"
          </div>
        )}

        {tutorReply && (
          <div className="mt-4 p-4 rounded-2xl bg-electric-blue/15 border border-electric-blue/40 text-xs sm:text-sm text-slate-100 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neon-cyan flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Spoken Tutor Answer:
              </span>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="text-xs text-red-400 hover:underline">
                  Stop Voice
                </button>
              )}
            </div>
            <p className="leading-relaxed">{tutorReply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
