package com.nawaf.almutayouti.quiz.data

import android.content.Context
import android.content.SharedPreferences
import com.nawaf.almutayouti.quiz.model.AppThemeSetting
import com.nawaf.almutayouti.quiz.model.FontSizeSetting
import com.nawaf.almutayouti.quiz.model.LeaderboardEntry
import org.json.JSONArray
import org.json.JSONObject

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("nawaf_quiz_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_MUSIC_ENABLED = "music_enabled"
        private const val KEY_THEME = "app_theme"
        private const val KEY_FONT_SIZE = "font_size"
        private const val KEY_LANGUAGE = "app_language"
        private const val KEY_LEADERBOARD = "leaderboard_entries"
    }

    var isMusicEnabled: Boolean
        get() = prefs.getBoolean(KEY_MUSIC_ENABLED, true)
        set(value) = prefs.edit().putBoolean(KEY_MUSIC_ENABLED, value).apply()

    var themeSetting: AppThemeSetting
        get() = when (prefs.getString(KEY_THEME, AppThemeSetting.NAVY_BLUE.name)) {
            AppThemeSetting.LIGHT.name -> AppThemeSetting.LIGHT
            AppThemeSetting.DARK.name -> AppThemeSetting.DARK
            else -> AppThemeSetting.NAVY_BLUE
        }
        set(value) = prefs.edit().putString(KEY_THEME, value.name).apply()

    var fontSizeSetting: FontSizeSetting
        get() = when (prefs.getString(KEY_FONT_SIZE, FontSizeSetting.MEDIUM.name)) {
            FontSizeSetting.SMALL.name -> FontSizeSetting.SMALL
            FontSizeSetting.LARGE.name -> FontSizeSetting.LARGE
            else -> FontSizeSetting.MEDIUM
        }
        set(value) = prefs.edit().putString(KEY_FONT_SIZE, value.name).apply()

    var language: String
        get() = prefs.getString(KEY_LANGUAGE, "ar") ?: "ar"
        set(value) = prefs.edit().putString(KEY_LANGUAGE, value).apply()

    fun getLeaderboard(): List<LeaderboardEntry> {
        val jsonString = prefs.getString(KEY_LEADERBOARD, "[]") ?: "[]"
        val list = mutableListOf<LeaderboardEntry>()
        try {
            val array = JSONArray(jsonString)
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                list.add(
                    LeaderboardEntry(
                        id = obj.optString("id", i.toString()),
                        playerName = obj.optString("playerName", "مشارك"),
                        score = obj.optInt("score", 0),
                        levelTitle = obj.optString("levelTitle", "المستوى الأول"),
                        correctCount = obj.optInt("correctCount", 0),
                        wrongCount = obj.optInt("wrongCount", 0),
                        timestamp = obj.optLong("timestamp", System.currentTimeMillis())
                    )
                )
            }
        } catch (_: Exception) {}
        return list.sortedByDescending { it.score }
    }

    fun saveLeaderboardEntry(entry: LeaderboardEntry) {
        val current = getLeaderboard().toMutableList()
        current.add(entry)
        val topList = current.sortedByDescending { it.score }.take(50)

        val array = JSONArray()
        for (item in topList) {
            val obj = JSONObject()
            obj.put("id", item.id)
            obj.put("playerName", item.playerName)
            obj.put("score", item.score)
            obj.put("levelTitle", item.levelTitle)
            obj.put("correctCount", item.correctCount)
            obj.put("wrongCount", item.wrongCount)
            obj.put("timestamp", item.timestamp)
            array.put(obj)
        }
        prefs.edit().putString(KEY_LEADERBOARD, array.toString()).apply()
    }
}
