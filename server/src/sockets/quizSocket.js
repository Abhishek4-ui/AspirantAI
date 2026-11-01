const LiveQuizSession = require('../models/LiveQuizSession');
const Question = require('../models/Question');

const setupQuizSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room
    socket.on('join_room', async ({ roomCode, userId, name }) => {
      try {
        const session = await LiveQuizSession.findOne({ roomCode: roomCode.toUpperCase() });
        if (!session) {
          return socket.emit('error_message', { message: 'Live quiz session not found.' });
        }

        socket.join(roomCode.toUpperCase());

        // Update or add participant
        const existingIndex = session.participants.findIndex(
          p => (userId && p.userId && p.userId.toString() === userId.toString()) || p.name === name
        );

        if (existingIndex >= 0) {
          session.participants[existingIndex].socketId = socket.id;
          session.participants[existingIndex].connected = true;
        } else {
          session.participants.push({
            userId: userId || null,
            name: name || 'Aspirant',
            socketId: socket.id,
            score: 0,
            connected: true
          });
        }

        await session.save();

        io.to(roomCode.toUpperCase()).emit('room_update', {
          roomCode: session.roomCode,
          status: session.status,
          title: session.title,
          participantsCount: session.participants.filter(p => p.connected).length,
          participants: session.participants.map(p => ({
            name: p.name,
            score: p.score,
            connected: p.connected
          }))
        });
      } catch (error) {
        console.error('[Socket Join Error]', error);
        socket.emit('error_message', { message: 'Could not join room.' });
      }
    });

    // Start quiz (Host action)
    socket.on('start_quiz', async ({ roomCode }) => {
      try {
        const session = await LiveQuizSession.findOne({ roomCode: roomCode.toUpperCase() }).populate({
          path: 'quizId',
          populate: { path: 'questions' }
        });

        if (!session) return;

        session.status = 'active';
        session.currentQuestionIndex = 0;
        session.startedAt = new Date();
        await session.save();

        const quiz = session.quizId;
        const currentQ = quiz.questions[0];

        // Send question WITHOUT revealing correct answer
        io.to(roomCode.toUpperCase()).emit('quiz_started', {
          questionIndex: 0,
          totalQuestions: quiz.questions.length,
          question: {
            id: currentQ._id,
            questionText: currentQ.questionText,
            questionHindi: currentQ.questionHindi,
            options: currentQ.options,
            optionsHindi: currentQ.optionsHindi,
            subject: currentQ.subject
          },
          durationSeconds: 30
        });
      } catch (error) {
        console.error('[Socket Start Error]', error);
      }
    });

    // Submit live question answer
    socket.on('submit_answer', async ({ roomCode, questionIndex, selectedAnswer, timeTakenMs }) => {
      try {
        const session = await LiveQuizSession.findOne({ roomCode: roomCode.toUpperCase() }).populate({
          path: 'quizId',
          populate: { path: 'questions' }
        });

        if (!session || session.status !== 'active') return;

        const participant = session.participants.find(p => p.socketId === socket.id);
        if (!participant) return;

        // Prevent duplicate submissions for the same question
        const alreadyAnswered = participant.answers.some(a => a.questionIndex === questionIndex);
        if (alreadyAnswered) return;

        const currentQ = session.quizId.questions[questionIndex];
        const isCorrect = currentQ && currentQ.correctAnswer.toUpperCase() === selectedAnswer.toUpperCase();
        const points = isCorrect ? 100 + Math.max(0, 50 - Math.floor(timeTakenMs / 1000) * 2) : 0;

        participant.score += points;
        participant.answers.push({
          questionIndex,
          selectedAnswer,
          timeTakenMs,
          isCorrect
        });

        await session.save();

        // Send individual confirmation
        socket.emit('answer_acknowledged', { isCorrect, points });

        // Update live leaderboard
        const sorted = [...session.participants].sort((a, b) => b.score - a.score);
        io.to(roomCode.toUpperCase()).emit('leaderboard_update', {
          leaderboard: sorted.slice(0, 10).map((p, idx) => ({
            rank: idx + 1,
            name: p.name,
            score: p.score
          }))
        });
      } catch (error) {
        console.error('[Socket Submit Error]', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      try {
        const session = await LiveQuizSession.findOne({ 'participants.socketId': socket.id });
        if (session) {
          const participant = session.participants.find(p => p.socketId === socket.id);
          if (participant) participant.connected = false;
          await session.save();

          io.to(session.roomCode).emit('room_update', {
            roomCode: session.roomCode,
            status: session.status,
            participantsCount: session.participants.filter(p => p.connected).length
          });
        }
      } catch (e) {
        // ignore
      }
    });
  });
};

module.exports = setupQuizSocket;
