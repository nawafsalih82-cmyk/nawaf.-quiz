import React from 'react';

interface AboutScreenProps {
  onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-full justify-between p-5 max-w-md mx-auto w-full">
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

          <h2 className="text-base font-black text-white flex items-center gap-1.5">
            <span>ℹ</span>
            <span>حول البرنامج</span>
          </h2>

          <div className="w-8" />
        </div>

        {/* Hero & Details */}
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-4xl shadow-xl shadow-amber-600/20 mb-4 select-none">
            🏆
          </div>

          <h1 className="text-xl font-black text-amber-400">
            مسابقات الأستاذ نواف المتيوتي
          </h1>

          <div className="mt-5 w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center shadow-lg">
            {/* Required exact text */}
            <p className="text-base font-extrabold text-white leading-relaxed">
              هذا البرنامج من تصميم الأستاذ نواف المتيوتي
            </p>

            <div className="my-3 border-t border-slate-700/70" />

            {/* Required exact text */}
            <p className="text-sm font-semibold text-slate-300">
              تطبيق مسابقات تعليمي وترفيهي لنظام Android.
            </p>

            <div className="my-4 border-t border-slate-700/70" />

            {/* Required exact features list */}
            <div className="space-y-1.5 text-sm font-bold text-amber-300/90 leading-relaxed text-right pr-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>20 سؤالًا</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>3 مستويات</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>مؤقت 30 ثانية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>نظام نقاط</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>مؤثرات صوتية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">•</span>
                <span>موسيقى خلفية</span>
              </div>
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="w-full mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 text-right space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-slate-300">com.nawaf.almutayouti.quiz</span>
              <span className="font-bold">معرف التطبيق:</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-slate-300">API 26 (Android 8.0) - API 36</span>
              <span className="font-bold">التوافق:</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-slate-300">1.0.0 (Offline Mode)</span>
              <span className="font-bold">الإصدار:</span>
            </div>
          </div>
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
