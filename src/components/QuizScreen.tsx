import React, { useState, useEffect, useRef } from 'react';
import { LevelId, Question } from '../types';
import { getPreparedQuestions } from '../data/quizQuestions';
import { soundService } from '../services/soundService';

interface QuizScreenProps {
  level: LevelId;
  onFinishQuiz: (score: number, correctCount: number, wrongCount: number) => void;
  onExit: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  fontSize: 'small' | 'medium' | 'large';
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  level,
  onFinishQuiz,
  onExit,
  musicEnabled,
  onToggleMusic,
  fontSize
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // 30 seconds timer
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'timeout';
    text: string;
  } | null>(null);

  const timerRef = useRef<number | null>(null);

  // Initialize questions on mount
  useEffect(() => {
    const list = getPreparedQuestions(level);
    setQuestions(list);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  }, [level]);

  // Handle background music during quiz
  useEffect(() => {
    if (musicEnabled) {
      soundService.startBackgroundMusic();
    } else {
      soundService.stopBackgroundMusic();
    }
    return () => {
      soundService.stopBackgroundMusic();
    };
  }, [musicEnabled]);

  const currentQuestion = questions[currentIndex];

  // 30-Second Countdown timer
  useEffect(() => {
    if (!currentQuestion || isAnswerEvaluated) return;

    setTimeLeft(30);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, currentQuestion, isAnswerEvaluated]);

  const handleTimeout = () => {
    setIsAnswerEvaluated(true);
    setWrongCount((w) => w + 1);
    setFeedback({ type: 'timeout', text: 'انتهى الوقت' });
    soundService.playTimeout();

    setTimeout(() => {
      advanceNextQuestion(score, correctCount, wrongCount + 1);
    }, 1000);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerEvaluated || !currentQuestion) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setSelectedOptionIndex(idx);
    setIsAnswerEvaluated(true);

    const isCorrect = idx === currentQuestion.correctIndex;

    if (isCorrect) {
      const newScore = score + 10;
      const newCorrect = correctCount + 1;
      setScore(newScore);
      setCorrectCount(newCorrect);
      setFeedback({ type: 'correct', text: 'أحسنت!' });
      soundService.playCorrect();

      setTimeout(() => {
        advanceNextQuestion(newScore, newCorrect, wrongCount);
      }, 1000);
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setFeedback({ type: 'wrong', text: 'حاول مرة أخرى' });
      soundService.playWrong();

      setTimeout(() => {
        advanceNextQuestion(score, correctCount, newWrong);
      }, 1000);
    }
  };

  const advanceNextQuestion = (currScore: number, currCorrect: number, currWrong: number) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerEvaluated(false);
      setFeedback(null);
    } else {
      // Quiz complete!
      soundService.stopBackgroundMusic();
      onFinishQuiz(currScore, currCorrect, currWrong);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-amber-400 font-bold animate-pulse">جاري تجهيز الأسئلة...</div>
      </div>
    );
  }

  const questionFontClass =
    fontSize === 'large'
      ? 'text-xl sm:text-2xl'
      : fontSize === 'small'
      ? 'text-base sm:text-lg'
      : 'text-lg sm:text-xl';

  const optionFontClass =
    fontSize === 'large'
      ? 'text-base sm:text-lg'
      : fontSize === 'small'
      ? 'text-sm'
      : 'text-sm sm:text-base';

  const timerColor =
    timeLeft <= 5
      ? 'text-red-500 border-red-500 bg-red-500/10 animate-pulse'
      : timeLeft <= 10
      ? 'text-amber-400 border-amber-400 bg-amber-400/10'
      : 'text-emerald-400 border-emerald-400 bg-emerald-400/10';

  return (
    <div className="flex flex-col min-h-full justify-between p-4 max-w-md mx-auto w-full">
      {/* Top Header Section as required */}
      <div>
        {/* Row 1: Exit button, Designer Header, Music toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <button
            onClick={onExit}
            aria-label="خروج"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <h2 className="text-sm font-black text-amber-400 leading-tight">
              الأستاذ نواف المتيوتي
            </h2>
            <p className="text-[11px] font-semibold text-slate-400">
              تصميم الأستاذ نواف المتيوتي
            </p>
          </div>

          <button
            onClick={onToggleMusic}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              musicEnabled
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span>{musicEnabled ? '♫' : '🔇'}</span>
            <span className="text-[11px] hidden xs:inline">
              {musicEnabled ? '♫ الموسيقى' : '🔇 الموسيقى متوقفة'}
            </span>
          </button>
        </div>

        {/* Row 2: Question Number, Prominent 30-sec Timer, Points */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">رقم السؤال</span>
            <span className="text-base font-extrabold text-white">
              السؤال {currentIndex + 1} من {questions.length}
            </span>
          </div>

          {/* Prominent Timer */}
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-2xl transition-all shadow-md ${timerColor}`}
            >
              {timeLeft}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400">مجموع النقاط</span>
            <span className="text-base font-extrabold text-amber-400">
              النقاط: {score}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Center: Question Card & Status Message */}
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="w-full bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className={`font-bold text-white leading-relaxed tracking-wide ${questionFontClass}`}>
            {currentQuestion.question}
          </p>
        </div>

        {/* Interactive Feedback Notification (أحسنت! / حاول مرة أخرى / انتهى الوقت) */}
        {feedback && (
          <div
            className={`mt-4 px-6 py-2.5 rounded-xl font-black text-lg flex items-center gap-2 shadow-lg animate-bounce ${
              feedback.type === 'correct'
                ? 'bg-emerald-600 text-white border border-emerald-400'
                : 'bg-rose-600 text-white border border-rose-400'
            }`}
          >
            <span>{feedback.type === 'correct' ? '✓' : '✕'}</span>
            <span>{feedback.text}</span>
          </div>
        )}
      </div>

      {/* Bottom: 4 Large Touch-Friendly Answer Buttons */}
      <div className="space-y-2.5 pb-2">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrect = idx === currentQuestion.correctIndex;

          let btnStyle =
            'bg-slate-800/90 hover:bg-slate-750 text-white border-slate-700/80 hover:border-amber-500/50 shadow-md';
          let iconMark = null;

          if (isAnswerEvaluated) {
            if (isSelected) {
              if (isCorrect) {
                // Correct answer selected -> GREEN with ✓
                btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/50 ring-2 ring-emerald-400';
                iconMark = '✓';
              } else {
                // Wrong answer selected -> RED with ✕
                btnStyle = 'bg-rose-600 text-white border-rose-400 shadow-rose-900/50 ring-2 ring-rose-400';
                iconMark = '✕';
              }
            } else if (isCorrect) {
              // Highlight the correct answer in green
              btnStyle = 'bg-emerald-600/80 text-white border-emerald-500 shadow-md';
              iconMark = '✓';
            } else {
              btnStyle = 'bg-slate-900/60 text-slate-500 border-slate-800/80 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswerEvaluated}
              className={`w-full text-right p-4 rounded-xl border font-bold transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] ${optionFontClass} ${btnStyle}`}
            >
              <span className="flex-1 text-right">{option}</span>
              {iconMark && (
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-black text-lg mr-2 shrink-0">
                  {iconMark}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
