import React from 'react';

interface HeaderProps {
  onBack?: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  showHome?: boolean;
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  musicEnabled,
  onToggleMusic,
  showHome,
  onHome
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sticky top-0 z-30">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="الرجوع"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showHome && onHome && (
            <button
              onClick={onHome}
              aria-label="الرئيسية"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-sm font-bold text-amber-400 tracking-wide">
            الأستاذ نواف المتيوتي
          </h2>
          <p className="text-[11px] font-medium text-slate-400">
            تصميم الأستاذ نواف المتيوتي
          </p>
        </div>

        <div>
          <button
            onClick={onToggleMusic}
            aria-label="تبديل الموسيقى"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span>{musicEnabled ? '♫' : '🔇'}</span>
            <span className="hidden sm:inline">
              {musicEnabled ? 'الموسيقى' : 'متوقفة'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
