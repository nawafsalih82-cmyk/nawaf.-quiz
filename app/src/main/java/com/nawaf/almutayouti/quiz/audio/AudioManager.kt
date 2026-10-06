package com.nawaf.almutayouti.quiz.audio

import android.content.Context
import android.media.MediaPlayer
import android.speech.tts.TextToSpeech
import java.util.Locale

class QuizAudioManager(private val context: Context) : TextToSpeech.OnInitListener {

    private var backgroundPlayer: MediaPlayer? = null
    private var sfxPlayer: MediaPlayer? = null
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    var isMusicEnabled = true

    init {
        try {
            tts = TextToSpeech(context.applicationContext, this)
        } catch (_: Exception) {
            tts = null
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val arLocale = Locale("ar")
            val result = tts?.setLanguage(arLocale)
            isTtsReady = result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED
            tts?.setSpeechRate(1.0f)
        }
    }

    fun startBackgroundMusic() {
        if (!isMusicEnabled) return
        stopBackgroundMusic()

        try {
            val resId = context.resources.getIdentifier("background_music", "raw", context.packageName)
            if (resId != 0) {
                backgroundPlayer = MediaPlayer.create(context, resId)?.apply {
                    isLooping = true
                    setVolume(0.35f, 0.35f)
                    start()
                }
            }
        } catch (_: Exception) {
            // Gracefully ignore missing raw resource or media error
            backgroundPlayer = null
        }
    }

    fun stopBackgroundMusic() {
        try {
            backgroundPlayer?.apply {
                if (isPlaying) stop()
                release()
            }
        } catch (_: Exception) {
        } finally {
            backgroundPlayer = null
        }
    }

    fun setMusicActive(enabled: Boolean) {
        isMusicEnabled = enabled
        if (enabled) {
            startBackgroundMusic()
        } else {
            stopBackgroundMusic()
        }
    }

    fun playCorrectSound() {
        // First try playing custom raw audio if provided
        var played = false
        try {
            val resId = context.resources.getIdentifier("correct", "raw", context.packageName)
            if (resId != 0) {
                sfxPlayer?.release()
                sfxPlayer = MediaPlayer.create(context, resId)?.apply {
                    start()
                    setOnCompletionListener { it.release() }
                }
                played = true
            }
        } catch (_: Exception) {
            played = false
        }

        // Always or fallback voice: speak Arabic "أحسنت!"
        if (isTtsReady && tts != null) {
            tts?.speak("أحسنت", TextToSpeech.QUEUE_FLUSH, null, "tts_correct")
        }
    }

    fun playWrongSound() {
        var played = false
        try {
            val resId = context.resources.getIdentifier("wrong", "raw", context.packageName)
            if (resId != 0) {
                sfxPlayer?.release()
                sfxPlayer = MediaPlayer.create(context, resId)?.apply {
                    start()
                    setOnCompletionListener { it.release() }
                }
                played = true
            }
        } catch (_: Exception) {
            played = false
        }

        // Always or fallback voice: speak Arabic "حاول مرة أخرى"
        if (isTtsReady && tts != null) {
            tts?.speak("حاول مرة أخرى", TextToSpeech.QUEUE_FLUSH, null, "tts_wrong")
        }
    }

    fun release() {
        stopBackgroundMusic()
        try {
            sfxPlayer?.release()
            sfxPlayer = null
            tts?.stop()
            tts?.shutdown()
            tts = null
        } catch (_: Exception) {}
    }
}
