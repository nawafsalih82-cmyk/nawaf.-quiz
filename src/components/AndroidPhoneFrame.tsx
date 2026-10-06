import React, { useState, useEffect } from 'react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  theme: 'blue' | 'dark' | 'light';
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({ children, theme }) => {
  const [timeStr, setTimeStr] = useState('12:00');
  const [isFramed, setIsFramed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const themeBgClass =
    theme === 'light'
      ? 'bg-slate-100 text-slate-900'
      : theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-[#0B192C] text-slate-100';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Top Controls Bar on desktop: Switch Device Frame / Fullscreen view */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <span>🤖</span>
          <span>نظام أندرويد 8.0+ (API 26-36)</span>
        </div>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
        >
          {isFramed ? '📱 وضع الشاشة الكاملة' : '📱 إطار هاتف أندرويد'}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-md ${
          isFramed
            ? 'h-[860px] rounded-[48px] border-[10px] border-slate-800 shadow-2xl ring-1 ring-slate-700/60 overflow-hidden relative'
            : 'min-h-screen sm:min-h-[750px] sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-2xl overflow-hidden'
        } ${themeBgClass} flex flex-col`}
      >
        {/* Android Status Bar */}
        <div className="w-full bg-slate-950/60 backdrop-blur-sm px-6 pt-2 pb-1.5 flex items-center justify-between text-xs font-semibold text-slate-300 z-20 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono tracking-wider">{timeStr}</span>
          </div>

          {/* Camera notch punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 shadow-inner" />

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400">4G</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="w-full bg-slate-950/40 py-2 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-500/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
