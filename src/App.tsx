import React, { useState, useEffect } from 'react';
import { ScreenState, AppSettings, LevelId } from './types';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AboutScreen } from './components/AboutScreen';
import { ExportApkModal } from './components/ExportApkModal';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ type: 'home' });
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  // Keep settings in sync with sound service
  useEffect(() => {
    storageService.saveSettings(settings);
    if (!settings.musicEnabled) {
      soundService.stopBackgroundMusic();
    }
  }, [settings]);

  const handleToggleMusic = () => {
    const updated = !settings.musicEnabled;
    const newSettings = { ...settings, musicEnabled: updated };
    setSettings(newSettings);
    if (!updated) {
      soundService.stopBackgroundMusic();
    } else if (screen.type === 'quiz') {
      soundService.startBackgroundMusic();
    }
  };

  const handleStartQuiz = (level: LevelId) => {
    setScreen({ type: 'quiz', level });
  };

  const handleFinishQuiz = (score: number, correctCount: number, wrongCount: number) => {
    if (screen.type === 'quiz') {
      setScreen({
        type: 'result',
        level: screen.level,
        score,
        correctCount,
        wrongCount
      });
    }
  };

  return (
    <div dir="rtl" className="w-full min-h-screen">
      <AndroidPhoneFrame theme={settings.theme}>
        {screen.type === 'home' && (
          <HomeScreen
            onStartQuiz={handleStartQuiz}
            onOpenSettings={() => setScreen({ type: 'settings' })}
            onOpenAbout={() => setScreen({ type: 'about' })}
            onOpenLeaderboard={() => setScreen({ type: 'leaderboard' })}
            onOpenExport={() => setScreen({ type: 'export' })}
            musicEnabled={settings.musicEnabled}
            onToggleMusic={handleToggleMusic}
          />
        )}

        {screen.type === 'quiz' && (
          <QuizScreen
            level={screen.level}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => {
              soundService.stopBackgroundMusic();
              setScreen({ type: 'home' });
            }}
            musicEnabled={settings.musicEnabled}
            onToggleMusic={handleToggleMusic}
            fontSize={settings.fontSize}
          />
        )}

        {screen.type === 'result' && (
          <ResultScreen
            level={screen.level}
            score={screen.score}
            correctCount={screen.correctCount}
            wrongCount={screen.wrongCount}
            onRestart={() => setScreen({ type: 'quiz', level: screen.level })}
            onChooseLevel={() => setScreen({ type: 'home' })}
            onGoHome={() => setScreen({ type: 'home' })}
            onOpenLeaderboard={() => setScreen({ type: 'leaderboard' })}
          />
        )}

        {screen.type === 'leaderboard' && (
          <LeaderboardScreen onBack={() => setScreen({ type: 'home' })} />
        )}

        {screen.type === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onBack={() => setScreen({ type: 'home' })}
          />
        )}

        {screen.type === 'about' && (
          <AboutScreen onBack={() => setScreen({ type: 'home' })} />
        )}

        {screen.type === 'export' && (
          <ExportApkModal onClose={() => setScreen({ type: 'home' })} />
        )}
      </AndroidPhoneFrame>
    </div>
  );
}
