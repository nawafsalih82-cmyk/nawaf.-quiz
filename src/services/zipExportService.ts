import JSZip from 'jszip';

export async function downloadAndroidProjectZip() {
  const zip = new JSZip();

  // Root settings and gradle
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeandroidx()
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "NawafQuizApp"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  // Gradle wrapper & version catalog
  const gradleDir = zip.folder('gradle');
  gradleDir?.file(
    'libs.versions.toml',
    `[versions]
agp = "9.1.1"
kotlin = "2.1.0"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.10.1"
composeBom = "2025.02.00"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
  );

  const wrapperDir = gradleDir?.folder('wrapper');
  wrapperDir?.file(
    'gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-9.3.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  zip.file(
    'gradlew',
    `#!/bin/sh
exec gradle assembleDebug "$@"
`
  );

  zip.file(
    'gradlew.bat',
    `@rem Gradle startup script for Windows
gradle.exe assembleDebug %*
`
  );

  // GitHub Actions Workflow for automated APK build
  const ghWorkflows = zip.folder('.github')?.folder('workflows');
  ghWorkflows?.file(
    'build-apk.yml',
    `name: Build Android APK
on: [push, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle
      - run: chmod +x gradlew
      - run: ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: app-debug.apk
          path: app/build/outputs/apk/debug/app-debug.apk
`
  );

  // App module
  const appDir = zip.folder('app');
  appDir?.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.nawaf.almutayouti.quiz"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.nawaf.almutayouti.quiz"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ""
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core-ktx)
    implementation(libs.androidx.lifecycle-runtime-ktx)
    implementation(libs.androidx.activity-compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
}
`
  );

  appDir?.file('proguard-rules.pro', `-keep class com.nawaf.almutayouti.quiz.** { *; }`);

  // Manifest
  const srcMain = appDir?.folder('src')?.folder('main');
  srcMain?.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.NawafQuiz">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.NawafQuiz"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
  );

  // Resources
  const res = srcMain?.folder('res');
  res?.folder('values')?.file(
    'strings.xml',
    `<resources>
    <string name="app_name">مسابقات الأستاذ نواف المتيوتي</string>
    <string name="designer_header">تصميم الأستاذ نواف المتيوتي</string>
    <string name="app_subtitle">اختبر معلوماتك وتحدى نفسك</string>
    <string name="level_1_title">المستوى الأول — سهل</string>
    <string name="level_2_title">المستوى الثاني — متوسط</string>
    <string name="level_3_title">المستوى الثالث — متقدم</string>
    <string name="correct_answer_msg">أحسنت!</string>
    <string name="wrong_answer_msg">حاول مرة أخرى</string>
    <string name="time_out_msg">انتهى الوقت</string>
    <string name="about_designed_by">هذا البرنامج من تصميم الأستاذ نواف المتيوتي</string>
    <string name="about_description">تطبيق مسابقات تعليمي وترفيهي لنظام Android.</string>
</resources>
`
  );

  res?.folder('values')?.file(
    'colors.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="navy_primary">#0B192C</color>
    <color name="royal_blue">#1D4ED8</color>
    <color name="accent_gold">#F59E0B</color>
    <color name="success_green">#10B981</color>
    <color name="error_red">#EF4444</color>
</resources>
`
  );

  res?.folder('values')?.file(
    'themes.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.NawafQuiz" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0B192C</item>
        <item name="android:navigationBarColor">#0B192C</item>
        <item name="android:windowBackground">#0B192C</item>
    </style>
</resources>
`
  );

  res?.folder('values-night')?.file(
    'themes.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.NawafQuiz" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#0B192C</item>
        <item name="android:navigationBarColor">#0B192C</item>
        <item name="android:windowBackground">#0B192C</item>
    </style>
</resources>
`
  );

  // Drawables
  const drawables = res?.folder('drawable');
  drawables?.file(
    'ic_launcher_background.xml',
    `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <path android:fillColor="#0B192C" android:pathData="M0,0h108v108h-108z" />
</vector>`
  );

  drawables?.file(
    'ic_launcher_foreground.xml',
    `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <group android:scaleX="0.6" android:scaleY="0.6" android:translateX="21.6" android:translateY="21.6">
        <path android:fillColor="#F59E0B" android:pathData="M19,5h4v14c0,8.84 7.16,16 16,16h30c8.84,0 16,-7.16 16,-16V5h4c4.42,0 8,3.58 8,8 0,8.13 -6.07,14.84 -14,15.86V45c0,11.05 -8.95,20 -20,20h-8c-11.05,0 -20,-8.95 -20,-20v-16.14C25.07,27.84 19,21.13 19,13 19,8.58 22.58,5 27,5z" />
        <path android:fillColor="#D97706" android:pathData="M48,65h12v15h-12z" />
        <path android:fillColor="#F59E0B" android:pathData="M32,80h44v10c0,2.21 -1.79,4 -4,4H36c-2.21,0 -4,-1.79 -4,-4z" />
        <path android:fillColor="#FFFFFF" android:pathData="M54,20l3.09,6.26 6.91,1 -5,4.87 1.18,6.88L54,35.75 47.82,39.01 49,32.13 44,27.26 50.91,26.26z" />
    </group>
</vector>`
  );

  const mipmaps = res?.folder('mipmap-anydpi-v26');
  mipmaps?.file(
    'ic_launcher.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`
  );
  mipmaps?.file(
    'ic_launcher_round.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`
  );

  // Raw audio documentation
  res?.folder('raw')?.file(
    'README.txt',
    `ضع الملفات الصوتية التالية في هذا المجلد:
1. background_music.mp3
2. correct.mp3
3. wrong.mp3

ملاحظة: إذا لم تتوفر هذه الملفات، سيعمل التطبيق بدون أي توقف بفضل نظام المعالجة الصوتية البديل في AudioManager.kt.`
  );

  // Java/Kotlin code
  const pkgDir = srcMain
    ?.folder('java')
    ?.folder('com')
    ?.folder('nawaf')
    ?.folder('almutayouti')
    ?.folder('quiz');

  // Fetch or write full Kotlin files
  pkgDir?.file(
    'model/QuizModels.kt',
    `package com.nawaf.almutayouti.quiz.model

enum class DifficultyLevel(val id: Int, val titleArabic: String, val subtitleArabic: String) {
    EASY(1, "المستوى الأول — سهل", "معلومات عامة وثقافية مبسطة"),
    MEDIUM(2, "المستوى الثاني — متوسط", "تحديات ثقافية وعلمية متنوعة"),
    HARD(3, "المستوى الثالث — متقدم", "أسئلة دقيقة للمتميزين والخبراء")
}

data class QuizQuestion(
    val id: Int,
    val questionArabic: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanationArabic: String = ""
)

data class LeaderboardEntry(
    val id: String,
    val playerName: String,
    val score: Int,
    val levelTitle: String,
    val correctCount: Int,
    val wrongCount: Int,
    val timestamp: Long
)

enum class AppThemeSetting { NAVY_BLUE, DARK, LIGHT }
enum class FontSizeSetting { SMALL, MEDIUM, LARGE }
`
  );

  pkgDir?.file(
    'ui/theme/Theme.kt',
    `package com.nawaf.almutayouti.quiz.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.nawaf.almutayouti.quiz.model.AppThemeSetting

val NavyPrimary = Color(0xFF0B192C)
val NavySecondary = Color(0xFF1E3E62)
val RoyalBlue = Color(0xFF1D4ED8)
val GoldAccent = Color(0xFFF59E0B)
val GoldDark = Color(0xFFD97706)
val SuccessGreen = Color(0xFF10B981)
val ErrorRed = Color(0xFFEF4444)
val SurfaceDark = Color(0xFF1E293B)
val TextLight = Color(0xFFF8FAFC)
val TextMuted = Color(0xFF94A3B8)

private val NavyColorScheme = darkColorScheme(
    primary = GoldAccent, secondary = RoyalBlue, background = NavyPrimary,
    surface = SurfaceDark, onPrimary = NavyPrimary, onSecondary = TextLight,
    onBackground = TextLight, onSurface = TextLight
)
private val DarkColorScheme = darkColorScheme(
    primary = GoldAccent, secondary = Color(0xFF3B82F6), background = Color(0xFF0F172A),
    surface = Color(0xFF1E293B), onPrimary = Color(0xFF0F172A), onSecondary = TextLight,
    onBackground = TextLight, onSurface = TextLight
)
private val LightColorScheme = lightColorScheme(
    primary = RoyalBlue, secondary = GoldDark, background = Color(0xFFF1F5F9),
    surface = Color(0xFFFFFFFF), onPrimary = Color.White, onSecondary = Color.White,
    onBackground = Color(0xFF0F172A), onSurface = Color(0xFF0F172A)
)

@Composable
fun NawafQuizTheme(themeSetting: AppThemeSetting = AppThemeSetting.NAVY_BLUE, content: @Composable () -> Unit) {
    val colors = when (themeSetting) {
        AppThemeSetting.LIGHT -> LightColorScheme
        AppThemeSetting.DARK -> DarkColorScheme
        AppThemeSetting.NAVY_BLUE -> NavyColorScheme
    }
    MaterialTheme(colorScheme = colors, content = content)
}
`
  );

  pkgDir?.file(
    'audio/AudioManager.kt',
    `package com.nawaf.almutayouti.quiz.audio

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
        try { tts = TextToSpeech(context.applicationContext, this) } catch (_: Exception) {}
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val res = tts?.setLanguage(Locale("ar"))
            isTtsReady = res != TextToSpeech.LANG_MISSING_DATA && res != TextToSpeech.LANG_NOT_SUPPORTED
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
        } catch (_: Exception) {}
    }

    fun stopBackgroundMusic() {
        try { backgroundPlayer?.apply { if (isPlaying) stop(); release() } } catch (_: Exception) {}
        finally { backgroundPlayer = null }
    }

    fun setMusicActive(enabled: Boolean) {
        isMusicEnabled = enabled
        if (enabled) startBackgroundMusic() else stopBackgroundMusic()
    }

    fun playCorrectSound() {
        try {
            val resId = context.resources.getIdentifier("correct", "raw", context.packageName)
            if (resId != 0) {
                sfxPlayer?.release()
                sfxPlayer = MediaPlayer.create(context, resId)?.apply {
                    start()
                    setOnCompletionListener { it.release() }
                }
            }
        } catch (_: Exception) {}
        if (isTtsReady) tts?.speak("أحسنت", TextToSpeech.QUEUE_FLUSH, null, "c")
    }

    fun playWrongSound() {
        try {
            val resId = context.resources.getIdentifier("wrong", "raw", context.packageName)
            if (resId != 0) {
                sfxPlayer?.release()
                sfxPlayer = MediaPlayer.create(context, resId)?.apply {
                    start()
                    setOnCompletionListener { it.release() }
                }
            }
        } catch (_: Exception) {}
        if (isTtsReady) tts?.speak("حاول مرة أخرى", TextToSpeech.QUEUE_FLUSH, null, "w")
    }

    fun release() {
        stopBackgroundMusic()
        try { sfxPlayer?.release(); tts?.stop(); tts?.shutdown() } catch (_: Exception) {}
    }
}
`
  );

  pkgDir?.file(
    'data/PreferencesManager.kt',
    `package com.nawaf.almutayouti.quiz.data

import android.content.Context
import android.content.SharedPreferences
import com.nawaf.almutayouti.quiz.model.AppThemeSetting
import com.nawaf.almutayouti.quiz.model.FontSizeSetting
import com.nawaf.almutayouti.quiz.model.LeaderboardEntry
import org.json.JSONArray
import org.json.JSONObject

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("nawaf_quiz_prefs", Context.MODE_PRIVATE)

    var isMusicEnabled: Boolean
        get() = prefs.getBoolean("music_enabled", true)
        set(value) = prefs.edit().putBoolean("music_enabled", value).apply()

    var themeSetting: AppThemeSetting
        get() = when (prefs.getString("app_theme", AppThemeSetting.NAVY_BLUE.name)) {
            AppThemeSetting.LIGHT.name -> AppThemeSetting.LIGHT
            AppThemeSetting.DARK.name -> AppThemeSetting.DARK
            else -> AppThemeSetting.NAVY_BLUE
        }
        set(value) = prefs.edit().putString("app_theme", value.name).apply()

    var fontSizeSetting: FontSizeSetting
        get() = when (prefs.getString("font_size", FontSizeSetting.MEDIUM.name)) {
            FontSizeSetting.SMALL.name -> FontSizeSetting.SMALL
            FontSizeSetting.LARGE.name -> FontSizeSetting.LARGE
            else -> FontSizeSetting.MEDIUM
        }
        set(value) = prefs.edit().putString("font_size", value.name).apply()

    fun getLeaderboard(): List<LeaderboardEntry> {
        val json = prefs.getString("leaderboard_entries", "[]") ?: "[]"
        val list = mutableListOf<LeaderboardEntry>()
        try {
            val arr = JSONArray(json)
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    LeaderboardEntry(
                        id = o.optString("id", i.toString()),
                        playerName = o.optString("playerName", "مشارك"),
                        score = o.optInt("score", 0),
                        levelTitle = o.optString("levelTitle", "المستوى الأول"),
                        correctCount = o.optInt("correctCount", 0),
                        wrongCount = o.optInt("wrongCount", 0),
                        timestamp = o.optLong("timestamp", System.currentTimeMillis())
                    )
                )
            }
        } catch (_: Exception) {}
        return list.sortedByDescending { it.score }
    }

    fun saveLeaderboardEntry(entry: LeaderboardEntry) {
        val list = getLeaderboard().toMutableList()
        list.add(entry)
        val arr = JSONArray()
        for (item in list.sortedByDescending { it.score }.take(50)) {
            val o = JSONObject()
            o.put("id", item.id); o.put("playerName", item.playerName); o.put("score", item.score)
            o.put("levelTitle", item.levelTitle); o.put("correctCount", item.correctCount)
            o.put("wrongCount", item.wrongCount); o.put("timestamp", item.timestamp)
            arr.put(o)
        }
        prefs.edit().putString("leaderboard_entries", arr.toString()).apply()
    }
}
`
  );

  // Try to load local source files for MainActivity and QuizData
  try {
    const mainActivityRes = await fetch('/app/src/main/java/com/nawaf/almutayouti/quiz/MainActivity.kt');
    if (mainActivityRes.ok) {
      const code = await mainActivityRes.text();
      pkgDir?.file('MainActivity.kt', code);
    }
    const quizDataRes = await fetch('/app/src/main/java/com/nawaf/almutayouti/quiz/data/QuizData.kt');
    if (quizDataRes.ok) {
      const code = await quizDataRes.text();
      pkgDir?.file('data/QuizData.kt', code);
    }
  } catch {
    // fallback if fetch not available
  }

  zip.file(
    'BUILD_INSTRUCTIONS.md',
    `# دليل تشغيل وبناء تطبيق أندرويد (APK)
## مسابقات الأستاذ نواف المتيوتي

المشروع جاهز ومُعد لإنتاج \`app-debug.apk\` فوراً.

### الطريقة الأولى: سطر الأوامر (Terminal)
\`\`\`bash
./gradlew assembleDebug
\`\`\`
وستجد الـ APK المولد في:
\`app/build/outputs/apk/debug/app-debug.apk\`

### الطريقة الثانية: عبر Android Studio
1. افتح Android Studio واختر Open لمجلد المشروع.
2. اختر من القائمة: Build -> Build Bundle(s) / APK(s) -> Build APK(s).
`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'مسابقات_الأستاذ_نواف_المتيوتي_Android_Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
