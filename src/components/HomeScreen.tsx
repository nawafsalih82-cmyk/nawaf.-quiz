import React from 'react';
import { LevelId } from '../types';
import { LEVELS } from '../data/quizQuestions';

interface HomeScreenProps {
  onStartQuiz: (level: LevelId) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenLeaderboard: () => void;
  onOpenExport: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuiz,
  onOpenSettings,
  onOpenAbout,
  onOpenLeaderboard,
  onOpenExport,
  musicEnabled,
  onToggleMusic
}) => {
  return (
    <div className="flex flex-col min-h-full justify-between p-5 max-w-md mx-auto w-full">
      {/* Top Bar with Music Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleMusic}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
            musicEnabled
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700/80 hover:bg-slate-700'
          }`}
        >
          <span className="text-sm">{musicEnabled ? '♫' : '🔇'}</span>
          <span>{musicEnabled ? '♫ الموسيقى' : '🔇 الموسيقى متوقفة'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-800 text-blue-300 hover:bg-blue-900 transition-colors cursor-pointer"
        >
          <span>📦</span>
          <span>حزمة APK</span>
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="flex flex-col items-center text-center my-6">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <span className="text-5xl select-none animate-pulse">🏆</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
          مسابقات الأستاذ نواف المتيوتي
        </h1>

        <p className="mt-2 text-sm sm:text-base font-semibold text-amber-400">
          اختبر معلوماتك وتحدى نفسك
        </p>

        <p className="mt-1 text-xs text-slate-400">
          تصميم الأستاذ نواف المتيوتي
        </p>
      </div>

      {/* Quiz Levels Section */}
      <div className="space-y-3.5 my-2">
        {LEVELS.map((level) => {
          const isEasy = level.id === 'easy';
          const isMedium = level.id === 'medium';

          return (
            <button
              key={level.id}
              onClick={() => onStartQuiz(level.id)}
              className={`w-full text-right p-4 rounded-2xl border transition-all transform active:scale-[0.98] cursor-pointer shadow-lg group relative overflow-hidden ${
                isEasy
                  ? 'bg-gradient-to-r from-slate-900 via-blue-950/90 to-blue-900/60 border-blue-700/60 hover:border-amber-400/80 shadow-blue-950/50'
                  : isMedium
                  ? 'bg-gradient-to-r from-slate-900 via-indigo-950/90 to-indigo-900/60 border-indigo-700/60 hover:border-amber-400/80 shadow-indigo-950/50'
                  : 'bg-gradient-to-r from-slate-900 via-purple-950/90 to-purple-900/60 border-purple-700/60 hover:border-amber-400/80 shadow-purple-950/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {level.title}
                  </h3>
                  <p className="text-xs text-slate-300/80 mt-0.5">
                    {level.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-400/90 font-medium">
                    <span>20 سؤالًا</span>
                    <span>•</span>
                    <span>30 ثانية لكل سؤال</span>
                    <span>•</span>
                    <span>10 نقاط لكل إجابة</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all">
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <span>🏅</span>
            <span>لوحة الأبطال</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            <span>⚙</span>
            <span>الإعدادات</span>
          </button>
        </div>

        <div className="mt-2.5">
          <button
            onClick={onOpenAbout}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>ℹ</span>
            <span>حول البرنامج</span>
          </button>
        </div>

        <div className="text-center mt-1">
          <p className="text-[11px] text-slate-500">
            تصميم الأستاذ نواف المتيوتي • الإصدار 1.0 (Android)
          </p>
        </div>
      </div>
    </div>
  );
};
