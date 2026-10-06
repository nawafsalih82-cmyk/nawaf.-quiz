import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelId } from '../types';
import { LEVELS } from '../data/quizQuestions';
import { storageService } from '../services/storageService';

interface ResultScreenProps {
  level: LevelId;
  score: number;
  correctCount: number;
  wrongCount: number;
  onRestart: () => void;
  onChooseLevel: () => void;
  onGoHome: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  level,
  score,
  correctCount,
  wrongCount,
  onRestart,
  onChooseLevel,
  onGoHome,
  onOpenLeaderboard
}) => {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const levelInfo = LEVELS.find((l) => l.id === level) || LEVELS[0];
  const percentage = Math.round((score / 200) * 100);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    const name = playerName.trim() || 'بطل المسابقة';
    storageService.addLeaderboardEntry({
      playerName: name,
      score,
      levelTitle: levelInfo.title,
      correctCount,
      wrongCount,
      percentage
    });
    setSaved(true);
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-5 max-w-md mx-auto w-full">
      {/* Top Banner */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-slate-400">
          تصميم الأستاذ نواف المتيوتي
        </p>
      </div>

      {/* Main Results Card */}
      <div className="flex flex-col items-center text-center my-auto py-2">
        <div className="text-6xl mb-2 animate-bounce select-none">🏆</div>

        <h1 className="text-2xl font-black text-amber-400">
          أحسنت!
        </h1>

        <h2 className="text-xl font-bold text-white mt-0.5">
          انتهت المسابقة
        </h2>

        <p className="text-xs font-medium text-slate-400 mt-1">
          {levelInfo.title}
        </p>

        {/* Big Score Box */}
        <div className="w-full mt-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
          <div className="text-3xl font-black text-amber-400 mb-3">
            نتيجتك: {score} / 200
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/80 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-semibold mb-1">
                الإجابات الصحيحة
              </span>
              <span className="text-lg font-black text-emerald-400">
                {correctCount}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-semibold mb-1">
                الإجابات الخاطئة
              </span>
              <span className="text-lg font-black text-rose-400">
                {wrongCount}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 font-semibold mb-1">
                النسبة
              </span>
              <span className="text-lg font-black text-blue-400">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Enter Player Name for Leaderboard */}
        <div className="w-full mt-4">
          {!saved ? (
            <form onSubmit={handleSaveScore} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
              <label htmlFor="playerNameInput" className="block text-xs font-bold text-amber-300 mb-2 text-right">
                🏅 سجل اسمك في لوحة الأبطال:
              </label>
              <div className="flex gap-2">
                <input
                  id="playerNameInput"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="أدخل اسمك هنا..."
                  className="flex-1 bg-slate-900 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 text-right"
                  maxLength={25}
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                >
                  حفظ
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-700/60 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">
                ✓ تم تسجيل نتيجتك في لوحة الأبطال بنجاح!
              </span>
              <button
                onClick={onOpenLeaderboard}
                className="text-xs font-bold underline text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                عرض اللوحة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800">
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>إعادة المسابقة</span>
        </button>

        <button
          onClick={onChooseLevel}
          className="w-full py-3 px-4 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
        >
          <span>📚</span>
          <span>اختيار مستوى آخر</span>
        </button>

        <button
          onClick={onGoHome}
          className="w-full py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          الرئيسية
        </button>
      </div>
    </div>
  );
};
