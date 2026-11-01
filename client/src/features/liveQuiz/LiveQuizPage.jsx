import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import appConfig from '../../config/appConfig';
import {
  Zap, Users, Trophy, Play, CheckCircle2,
  Clock, AlertCircle, Shield, Award
} from 'lucide-react';

export default function LiveQuizPage() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [activeRooms, setActiveRooms] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socketClient = io(appConfig.SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    setSocket(socketClient);

    socketClient.on('connect', () => {
      console.log('Connected to AspirantAI Live Quiz Socket');
    });

    socketClient.on('room_update', (data) => {
      setActiveSession(prev => ({ ...prev, ...data }));
      setParticipantsCount(data.participantsCount || 0);
    });

    socketClient.on('quiz_started', (data) => {
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setSelectedAnswer(null);
      setFeedback(null);
    });

    socketClient.on('answer_acknowledged', (data) => {
      setFeedback(data);
    });

    socketClient.on('leaderboard_update', (data) => {
      setLeaderboard(data.leaderboard || []);
    });

    socketClient.on('error_message', (data) => {
      setError(data.message);
    });

    // Fetch active live quiz sessions
    api.get('/live-quiz/sessions').then(res => {
      if (res.data.success) {
        setActiveRooms(res.data.sessions);
      }
    }).catch(() => {});

    return () => {
      socketClient.disconnect();
    };
  }, []);

  const handleJoinRoom = (codeToJoin) => {
    const code = (codeToJoin || roomCode).toUpperCase().trim();
    if (!code) return;

    setError('');
    socket.emit('join_room', {
      roomCode: code,
      userId: user?._id,
      name: user?.name || 'Aspirant'
    });
    setActiveSession({ roomCode: code, status: 'waiting' });
  };

  const handleCreateRoom = async () => {
    try {
      const res = await api.post('/live-quiz/create', {
        title: 'All-India Live Speed Challenge'
      });
      if (res.data.success) {
        setRoomCode(res.data.roomCode);
        handleJoinRoom(res.data.roomCode);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room.');
    }
  };

  const handleStartQuiz = () => {
    if (!activeSession?.roomCode) return;
    socket.emit('start_quiz', { roomCode: activeSession.roomCode });
  };

  const handleSubmitLiveAnswer = (optKey) => {
    if (selectedAnswer) return; // Prevent duplicate answers
    setSelectedAnswer(optKey);

    socket.emit('submit_answer', {
      roomCode: activeSession.roomCode,
      questionIndex,
      selectedAnswer: optKey,
      timeTakenMs: 4000
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/15 border border-neon-cyan/40 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <Zap className="w-3.5 h-3.5" /> Socket.IO Real-Time Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          All-India Live Quiz Arena
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Compete in synchronized real-time speed challenges against aspirants across India. Server-authoritative countdown and live leaderboards.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!activeSession ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Join with Code */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-electric-blue/20 text-neon-cyan flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join a Live Lobby</h3>
              <p className="text-xs text-slate-400 mb-6">Enter a 6-character room code shared by your peer or study group.</p>

              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE (e.g. A9B2C1)"
                className="w-full text-center tracking-widest py-3 text-lg font-mono font-bold rounded-xl glass-input text-white uppercase mb-4"
              />
            </div>

            <button
              onClick={() => handleJoinRoom()}
              disabled={roomCode.trim().length < 4}
              className="w-full py-3 rounded-xl bg-electric-blue text-white font-bold text-sm shadow-glow-blue hover:brightness-110 disabled:opacity-40"
            >
              Enter Live Room
            </button>
          </div>

          {/* Host New Room */}
          <div className="glass-panel rounded-3xl p-8 border border-neon-purple/40 text-center flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 text-neon-purple flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Host Instant Session</h3>
              <p className="text-xs text-slate-400 mb-6">Create a new live room instantly. Invite friends or study groups to test speed and accuracy.</p>
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-electric-blue text-white font-bold text-sm shadow-glow-purple hover:brightness-110"
            >
              Generate Live Room
            </button>
          </div>
        </div>
      ) : (
        /* Active Lobby & Quiz Screen */
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-electric-blue/30">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Room Code:</span>
              <span className="font-mono text-base font-black text-neon-cyan px-2.5 py-0.5 rounded-lg bg-navy-800 border border-slate-700">
                {activeSession.roomCode}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-2">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <strong className="text-white">{participantsCount}</strong> Connected
              </span>
            </div>

            {activeSession.status === 'waiting' && (
              <button
                onClick={handleStartQuiz}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Start Live Quiz Now
              </button>
            )}
          </div>

          {currentQuestion ? (
            /* Live Question View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-electric-blue/40">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
                  <span className="font-bold text-neon-cyan">
                    Live Question {questionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-amber-400 font-semibold">Speed Points Active</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options?.map((opt) => {
                    const isSelected = selectedAnswer === opt.key;
                    return (
                      <button
                        key={opt.key}
                        disabled={!!selectedAnswer}
                        onClick={() => handleSubmitLiveAnswer(opt.key)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-electric-blue/30 border-electric-blue text-white shadow-glow-blue'
                            : 'bg-navy-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="w-8 h-8 rounded-lg bg-navy-800 font-bold text-xs flex items-center justify-center">
                          {opt.key}
                        </span>
                        <span className="text-sm font-medium">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {feedback && (
                  <div className={`mt-6 p-4 rounded-2xl border text-xs font-bold text-center ${
                    feedback.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                      : 'bg-red-950/40 border-red-500/50 text-red-400'
                  }`}>
                    {feedback.isCorrect ? `✓ Correct Answer! +${feedback.points} Speed Points` : '✗ Incorrect choice. Next question incoming...'}
                  </div>
                )}
              </div>

              {/* Live Leaderboard */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Live Standings
                </h4>
                <div className="space-y-2">
                  {leaderboard.length === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-8">Awaiting first responses...</div>
                  ) : (
                    leaderboard.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-navy-900/80 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-navy-800 text-[10px] font-bold flex items-center justify-center text-neon-cyan">
                            #{item.rank}
                          </span>
                          <span className="font-semibold text-white">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-neon-cyan">{item.score} pts</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Waiting in Lobby */
            <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-electric-blue/20 border border-electric-blue/40 flex items-center justify-center mx-auto mb-4 text-neon-cyan animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Waiting in Lobby</h3>
              <p className="text-xs text-slate-400">The live session host will initiate the countdown momentarily.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
