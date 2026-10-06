import React, { useState } from 'react';
import { downloadAndroidProjectZip } from '../services/zipExportService';

interface ExportApkModalProps {
  onClose: () => void;
}

export const ExportApkModal: React.FC<ExportApkModalProps> = ({ onClose }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAndroidProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full justify-between p-4 max-w-md mx-auto w-full">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5">
            <span>📦</span>
            <span>مشروع أندرويد وبناء APK</span>
          </h2>

          <div className="w-8" />
        </div>

        <div className="mt-4 space-y-4 text-right">
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-800/80 rounded-2xl p-4 shadow-lg">
            <h3 className="font-extrabold text-white text-base mb-1">
              حزمة مشروع أندرويد جاهزة للتثبيت
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تم توليد كامل ملفات نظام Android Native (Jetpack Compose + Gradle 9.3.1 + AGP 9.1.1 + Java 17) بالمواصفات الفنية المطلوبة لبناء ملف <code className="text-amber-400 font-mono">app-debug.apk</code>.
            </p>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-4 w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              <span>{downloading ? '⏳' : '📥'}</span>
              <span>
                {downloading ? 'جاري تجهيز حزمة ZIP...' : 'تحميل مشروع أندرويد بالكامل (ZIP)'}
              </span>
            </button>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-amber-400 mb-2">
              طريقة التجميع وتوليد APK على حاسوبك:
            </h4>
            <ol className="text-xs text-slate-300 space-y-2.5 pr-4 list-decimal leading-relaxed">
              <li>
                قم بتحميل وفك ضغط ملف الـ ZIP.
              </li>
              <li>
                افتح المجلد في <strong className="text-white">Android Studio</strong> أو في سطر الأوامر (Terminal).
              </li>
              <li>
                نفّذ الأمر التالي:
                <pre className="bg-slate-950 p-2.5 rounded-lg text-emerald-400 font-mono mt-1 text-[11px] ltr text-left overflow-x-auto">
./gradlew assembleDebug
                </pre>
              </li>
              <li>
                ستجد ملف الـ APK المولد في المسار:
                <div className="bg-slate-950 p-2 rounded-lg text-amber-300 font-mono mt-1 text-[11px] ltr text-left">
app/build/outputs/apk/debug/app-debug.apk
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 leading-normal">
            💡 التطبيق متوافق 100% مع أندرويد 8.0 (API 26) حتى أندرويد 15/16 (API 36)، ومجهز بنظام كامل للعمل دون اتصال بالإنترنت (Offline).
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          العودة
        </button>
      </div>
    </div>
  );
};
