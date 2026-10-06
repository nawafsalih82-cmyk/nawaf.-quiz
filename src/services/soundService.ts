// Audio Service with Web Audio API + Arabic Speech Synthesis + Fallback Audio Elements

class SoundService {
  private audioCtx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private backgroundAudioEl: HTMLAudioElement | null = null;

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Play Arabic spoken voice ("أحسنت" or "حاول مرة أخرى")
  private speakArabic(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 1.0;
        utterance.pitch = 1.05;

        // Try to pick an Arabic voice if available
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis not available', err);
      }
    }
  }

  // Correct answer: play chime + speak "أحسنت!"
  playCorrect() {
    this.initAudioContext();
    this.speakArabic('أحسنت!');

    // Also play bright harmonious chime
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch (e) {
      console.warn('Error playing correct chime', e);
    }
  }

  // Wrong answer: play low tone + speak "حاول مرة أخرى"
  playWrong() {
    this.initAudioContext();
    this.speakArabic('حاول مرة أخرى');

    // Also play gentle low alert tone
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(174.61, now + 0.35); // F3

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Error playing wrong tone', e);
    }
  }

  // Timeout tone
  playTimeout() {
    this.initAudioContext();
    this.speakArabic('انتهى الوقت');

    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(250, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Error playing timeout tone', e);
    }
  }

  // Background Music: Royalty-free calm ambient harmonic progression
  startBackgroundMusic() {
    if (this.isMusicPlaying) return;
    this.initAudioContext();
    this.isMusicPlaying = true;

    // Check if an external royalty-free MP3 is accessible
    try {
      if (!this.backgroundAudioEl) {
        this.backgroundAudioEl = new Audio('/audio/background_music.mp3');
        this.backgroundAudioEl.loop = true;
        this.backgroundAudioEl.volume = 0.3;
      }
      const playPromise = this.backgroundAudioEl.play();
      if (playPromise) {
        playPromise.catch(() => {
          // If MP3 is missing or blocked, gracefully fallback to Web Audio synthesizer!
          this.startSynthesizedAmbientLoop();
        });
        return;
      }
    } catch {
      // Graceful fallback without crashing
      this.startSynthesizedAmbientLoop();
    }
  }

  private startSynthesizedAmbientLoop() {
    if (!this.audioCtx) return;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
    }

    const chords = [
      [220, 261.63, 329.63], // Am (A3, C4, E4)
      [174.61, 220, 261.63], // F (F3, A3, C4)
      [261.63, 329.63, 392], // C (C4, E4, G4)
      [196, 246.94, 293.66]  // G (G3, B3, D4)
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.audioCtx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      const now = this.audioCtx.currentTime;
      currentChord.forEach((freq) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.8);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, 3500);
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.backgroundAudioEl) {
      try {
        this.backgroundAudioEl.pause();
        this.backgroundAudioEl.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }

  isMusicActive(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundService = new SoundService();
