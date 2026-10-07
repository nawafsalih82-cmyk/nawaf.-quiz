# Raw Audio Assets Directory

This folder is designed to receive:
1. `background_music.mp3` - Royalty-free background music loop for the quiz.
2. `correct.mp3` - Success chime / voice saying "أحسنت".
3. `wrong.mp3` - Sound saying "حاول مرة أخرى".

### Graceful Fallback
The application code in `AudioManager.kt` checks for these files dynamically at runtime using `resources.getIdentifier()`.
If the MP3 files are missing or empty, the app **never crashes**; instead it uses Android's built-in `TextToSpeech` engine in Arabic or a soft synthesized audio tone.
