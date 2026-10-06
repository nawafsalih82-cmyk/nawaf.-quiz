import React from 'react';
import { storageService } from '../services/storageService';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const entries = storageService.getLeaderboard();

  return (
    <div className="flex flex-col min-h-full justify-between p-4 max-w-md mx-auto w-full">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5">
            <span>🏅</span>
            <span>لوحة الأبطال</span>
          </h2>

          <div className="w-8" />
        </div>

        <div className="mt-4">
          {entries.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-800/40 rounded-2xl border border-slate-800">
              <span className="text-4xl block mb-2">🏆</span>
              <p className="text-sm font-bold text-slate-300">
                لا توجد نتائج مسجلة بعد
              </p>
              <p className="text-xs text-slate-500 mt-1">
                أنهِ إحدى المسابقات وسجل اسمك لتظهر في لوحة الشرف!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {entries.map((entry, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isFirst
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : isSecond
                        ? 'bg-slate-700/50 border-slate-500/50'
                        : isThird
                        ? 'bg-amber-900/20 border-amber-800/40'
                        : 'bg-slate-850/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0">
                        {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${index + 1}`}
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white text-sm">
                          {entry.playerName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {entry.levelTitle} • {entry.correctCount} صح / {entry.wrongCount} خطأ
                        </div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="text-base font-black text-amber-400">
                        {entry.score} نقطة
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {entry.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};
