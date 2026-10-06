import React from 'react';
import { AppSettings, ThemeOption, FontSizeOption, LanguageOption } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const handleThemeChange = (theme: ThemeOption) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleFontSizeChange = (fontSize: FontSizeOption) => {
    onUpdateSettings({ ...settings, fontSize });
  };

  const handleLanguageChange = (language: LanguageOption) => {
    onUpdateSettings({ ...settings, language });
  };

  const handleMusicToggle = () => {
    onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled });
  };

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

          <h2 className="text-base font-black text-white flex items-center gap-1.5">
            <span>⚙</span>
            <span>الإعدادات</span>
          </h2>

          <div className="w-8" />
        </div>

        <div className="mt-5 space-y-4">
          {/* 1. Theme Option */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <label className="block text-sm font-bold text-white mb-2 text-right">
              🎨 الثيم (المظهر)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('blue')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'blue'
                    ? 'bg-blue-600 text-white ring-2 ring-amber-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                أزرق كحلي
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-slate-950 text-white ring-2 ring-amber-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                داكن (Dark)
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-slate-200 text-slate-950 ring-2 ring-amber-400'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                فاتح (Light)
              </button>
            </div>
          </div>

          {/* 2. Font Size Option */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <label className="block text-sm font-bold text-white mb-2 text-right">
              🔤 حجم الخط
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleFontSizeChange('small')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.fontSize === 'small'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                صغير
              </button>
              <button
                onClick={() => handleFontSizeChange('medium')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.fontSize === 'medium'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                متوسط
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.fontSize === 'large'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                كبير
              </button>
            </div>
          </div>

          {/* 3. Language Option */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">🌐 اللغة</span>
              <span className="text-[11px] text-amber-400 font-semibold">
                العربية (افتراضي)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.language === 'ar'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                العربية (Arabic)
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-750'
                }`}
              >
                English (قريبًا)
              </button>
            </div>
          </div>

          {/* 4. Music Toggle */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-white">♫ الموسيقى</span>
              <span className="text-xs text-slate-400">
                تشغيل الموسيقى الخلفية أثناء حل المسابقة
              </span>
            </div>

            <button
              onClick={handleMusicToggle}
              className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                settings.musicEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md flex items-center justify-center text-[10px]">
                {settings.musicEnabled ? '♫' : '✕'}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          حفظ والعودة
        </button>
      </div>
    </div>
  );
};
