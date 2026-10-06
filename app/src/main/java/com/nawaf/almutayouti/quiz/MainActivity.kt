package com.nawaf.almutayouti.quiz

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nawaf.almutayouti.quiz.audio.QuizAudioManager
import com.nawaf.almutayouti.quiz.data.PreferencesManager
import com.nawaf.almutayouti.quiz.data.QuizData
import com.nawaf.almutayouti.quiz.model.*
import com.nawaf.almutayouti.quiz.ui.theme.*
import kotlinx.coroutines.delay
import java.util.UUID

sealed class Screen {
    object Home : Screen()
    data class Quiz(val level: DifficultyLevel) : Screen()
    data class Result(
        val level: DifficultyLevel,
        val score: Int,
        val correctCount: Int,
        val wrongCount: Int,
        val totalQuestions: Int = 20
    ) : Screen()
    object Leaderboard : Screen()
    object Settings : Screen()
    object About : Screen()
}

class MainActivity : ComponentActivity() {
    private lateinit var audioManager: QuizAudioManager
    private lateinit var prefsManager: PreferencesManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        audioManager = QuizAudioManager(this)
        prefsManager = PreferencesManager(this)
        audioManager.isMusicEnabled = prefsManager.isMusicEnabled

        setContent {
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                var currentTheme by remember { mutableStateOf(prefsManager.themeSetting) }
                var currentFontSize by remember { mutableStateOf(prefsManager.fontSizeSetting) }
                var isMusicOn by remember { mutableStateOf(prefsManager.isMusicEnabled) }
                var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }

                NawafQuizTheme(themeSetting = currentTheme) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        when (val screen = currentScreen) {
                            is Screen.Home -> {
                                HomeScreen(
                                    isMusicOn = isMusicOn,
                                    onToggleMusic = {
                                        isMusicOn = !isMusicOn
                                        prefsManager.isMusicEnabled = isMusicOn
                                        audioManager.setMusicActive(isMusicOn)
                                    },
                                    onSelectLevel = { level ->
                                        currentScreen = Screen.Quiz(level)
                                        if (isMusicOn) audioManager.startBackgroundMusic()
                                    },
                                    onOpenLeaderboard = { currentScreen = Screen.Leaderboard },
                                    onOpenSettings = { currentScreen = Screen.Settings },
                                    onOpenAbout = { currentScreen = Screen.About }
                                )
                            }
                            is Screen.Quiz -> {
                                QuizPlayScreen(
                                    level = screen.level,
                                    audioManager = audioManager,
                                    isMusicOn = isMusicOn,
                                    onToggleMusic = {
                                        isMusicOn = !isMusicOn
                                        prefsManager.isMusicEnabled = isMusicOn
                                        audioManager.setMusicActive(isMusicOn)
                                    },
                                    onFinishQuiz = { score, correct, wrong ->
                                        audioManager.stopBackgroundMusic()
                                        currentScreen = Screen.Result(screen.level, score, correct, wrong)
                                    },
                                    onExitToHome = {
                                        audioManager.stopBackgroundMusic()
                                        currentScreen = Screen.Home
                                    }
                                )
                            }
                            is Screen.Result -> {
                                ResultScreen(
                                    result = screen,
                                    prefsManager = prefsManager,
                                    onRestart = {
                                        currentScreen = Screen.Quiz(screen.level)
                                        if (isMusicOn) audioManager.startBackgroundMusic()
                                    },
                                    onSelectAnotherLevel = {
                                        currentScreen = Screen.Home
                                    },
                                    onGoHome = {
                                        currentScreen = Screen.Home
                                    }
                                )
                            }
                            is Screen.Leaderboard -> {
                                LeaderboardScreen(
                                    prefsManager = prefsManager,
                                    onBack = { currentScreen = Screen.Home }
                                )
                            }
                            is Screen.Settings -> {
                                SettingsScreen(
                                    currentTheme = currentTheme,
                                    currentFontSize = currentFontSize,
                                    isMusicOn = isMusicOn,
                                    onThemeChange = {
                                        currentTheme = it
                                        prefsManager.themeSetting = it
                                    },
                                    onFontSizeChange = {
                                        currentFontSize = it
                                        prefsManager.fontSizeSetting = it
                                    },
                                    onMusicToggle = {
                                        isMusicOn = it
                                        prefsManager.isMusicEnabled = it
                                        audioManager.setMusicActive(it)
                                    },
                                    onBack = { currentScreen = Screen.Home }
                                )
                            }
                            is Screen.About -> {
                                AboutScreen(
                                    onBack = { currentScreen = Screen.Home }
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        audioManager.release()
    }
}

@Composable
fun TopDesignerBanner() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterAlignmentHorizontally
    ) {
        Text(
            text = "الأستاذ نواف المتيوتي",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = GoldAccent
        )
        Text(
            text = "تصميم الأستاذ نواف المتيوتي",
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
            color = TextMuted
        )
    }
}

@Composable
fun HomeScreen(
    isMusicOn: Boolean,
    onToggleMusic: () -> Unit,
    onSelectLevel: (DifficultyLevel) -> Unit,
    onOpenLeaderboard: () -> Unit,
    onOpenSettings: () -> Unit,
    onOpenAbout: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterAlignmentHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterAlignmentHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onToggleMusic) {
                    Text(
                        text = if (isMusicOn) "♫" else "🔇",
                        fontSize = 22.sp
                    )
                }
                Text(
                    text = if (isMusicOn) "♫ الموسيقى" else "🔇 الموسيقى متوقفة",
                    fontSize = 13.sp,
                    color = if (isMusicOn) GoldAccent else TextMuted
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Trophy icon & Main Title
            Text(
                text = "🏆",
                fontSize = 58.sp,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "مسابقات الأستاذ نواف المتيوتي",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextLight,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "اختبر معلوماتك وتحدى نفسك",
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium,
                color = GoldAccent,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(30.dp))

            // Difficulty Level Buttons
            DifficultyLevel.values().forEach { level ->
                Button(
                    onClick = { onSelectLevel(level) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                        .padding(vertical = 4.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = when (level) {
                            DifficultyLevel.EASY -> NavySecondary
                            DifficultyLevel.MEDIUM -> RoyalBlue
                            DifficultyLevel.HARD -> Color(0xFF1E1B4B)
                        }
                    )
                ) {
                    Column(horizontalAlignment = Alignment.CenterAlignmentHorizontally) {
                        Text(
                            text = level.titleArabic,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "20 سؤالاً • 30 ثانية لكل سؤال",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }

        // Secondary Navigation Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterAlignmentHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenLeaderboard,
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("🏅 لوحة الأبطال", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
                OutlinedButton(
                    onClick = onOpenSettings,
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("⚙ الإعدادات", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            TextButton(onClick = onOpenAbout) {
                Text("ℹ حول البرنامج", fontSize = 14.sp, color = TextMuted)
            }

            Text(
                text = "تصميم الأستاذ نواف المتيوتي",
                fontSize = 12.sp,
                color = TextMuted.copy(alpha = 0.7f),
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@Composable
fun QuizPlayScreen(
    level: DifficultyLevel,
    audioManager: QuizAudioManager,
    isMusicOn: Boolean,
    onToggleMusic: () -> Unit,
    onFinishQuiz: (score: Int, correct: Int, wrong: Int) -> Unit,
    onExitToHome: () -> Unit
) {
    val questions = remember { QuizData.getQuestionsForLevel(level) }
    var currentIndex by remember { mutableIntStateOf(0) }
    var score by remember { mutableIntStateOf(0) }
    var correctCount by remember { mutableIntStateOf(0) }
    var wrongCount by remember { mutableIntStateOf(0) }
    var timeLeft by remember { mutableIntStateOf(30) }
    var selectedAnswerIndex by remember { mutableStateOf<Int?>(null) }
    var isAnswerEvaluated by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var isStatusSuccess by remember { mutableStateOf(false) }

    val currentQuestion = questions[currentIndex]

    // 30-Second Countdown Timer
    LaunchedEffect(currentIndex, isAnswerEvaluated) {
        if (!isAnswerEvaluated) {
            timeLeft = 30
            while (timeLeft > 0 && !isAnswerEvaluated) {
                delay(1000L)
                timeLeft--
            }
            if (timeLeft <= 0 && !isAnswerEvaluated) {
                // Timeout expiration
                isAnswerEvaluated = true
                wrongCount++
                statusMessage = "انتهى الوقت"
                isStatusSuccess = false
                audioManager.playWrongSound()
                delay(1000L)
                if (currentIndex + 1 < questions.size) {
                    currentIndex++
                    selectedAnswerIndex = null
                    isAnswerEvaluated = false
                    statusMessage = null
                } else {
                    onFinishQuiz(score, correctCount, wrongCount)
                }
            }
        }
    }

    fun handleAnswerSelection(index: Int) {
        if (isAnswerEvaluated) return
        selectedAnswerIndex = index
        isAnswerEvaluated = true

        val isCorrect = (index == currentQuestion.correctIndex)
        if (isCorrect) {
            score += 10
            correctCount++
            statusMessage = "أحسنت!"
            isStatusSuccess = true
            audioManager.playCorrectSound()
        } else {
            wrongCount++
            statusMessage = "حاول مرة أخرى"
            isStatusSuccess = false
            audioManager.playWrongSound()
        }
    }

    LaunchedEffect(isAnswerEvaluated) {
        if (isAnswerEvaluated && timeLeft > 0) {
            delay(1000L)
            if (currentIndex + 1 < questions.size) {
                currentIndex++
                selectedAnswerIndex = null
                isAnswerEvaluated = false
                statusMessage = null
            } else {
                onFinishQuiz(score, correctCount, wrongCount)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Header Section
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onExitToHome) {
                    Icon(Icons.Default.Close, contentDescription = "خروج", tint = TextMuted)
                }
                TopDesignerBanner()
                IconButton(onClick = onToggleMusic) {
                    Text(text = if (isMusicOn) "♫" else "🔇", fontSize = 18.sp)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Quiz Info Row: Question number, Timer, Current Score
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "السؤال ${currentIndex + 1} من ${questions.size}",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextLight
                )

                // Prominent Timer Display
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(
                            if (timeLeft <= 5) ErrorRed.copy(alpha = 0.2f)
                            else GoldAccent.copy(alpha = 0.15f)
                        )
                        .border(
                            2.dp,
                            if (timeLeft <= 5) ErrorRed else GoldAccent,
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "$timeLeft",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = if (timeLeft <= 5) ErrorRed else GoldAccent
                    )
                }

                Text(
                    text = "النقاط: $score",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldAccent
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Progress Bar
            LinearProgressIndicator(
                progress = (currentIndex + 1) / questions.size.toFloat(),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = GoldAccent,
                trackColor = SurfaceDark
            )
        }

        // Center: Question Card & Status Message
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(vertical = 12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier.padding(22.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = currentQuestion.questionArabic,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        textAlign = TextAlign.Center,
                        lineHeight = 28.sp
                    )
                }
            }

            // Status notification badge
            AnimatedVisibility(visible = statusMessage != null) {
                Card(
                    modifier = Modifier
                        .padding(top = 16.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isStatusSuccess) SuccessGreen else ErrorRed
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 24.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isStatusSuccess) "✓ " else "✕ ",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = statusMessage ?: "",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // Bottom: 4 Large Answer Buttons
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            currentQuestion.options.forEachIndexed { index, option ->
                val isSelected = (selectedAnswerIndex == index)
                val isCorrectAnswer = (index == currentQuestion.correctIndex)

                val buttonColor = when {
                    !isAnswerEvaluated -> SurfaceDark
                    isSelected && isCorrectAnswer -> SuccessGreen
                    isSelected && !isCorrectAnswer -> ErrorRed
                    !isSelected && isCorrectAnswer -> SuccessGreen.copy(alpha = 0.85f)
                    else -> SurfaceDark.copy(alpha = 0.5f)
                }

                Button(
                    onClick = { handleAnswerSelection(index) },
                    enabled = !isAnswerEvaluated,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(58.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = buttonColor,
                        disabledContainerColor = buttonColor
                    )
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = option,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                        )
                        if (isAnswerEvaluated) {
                            if (isSelected && isCorrectAnswer) {
                                Text("✓", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            } else if (isSelected && !isCorrectAnswer) {
                                Text("✕", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            } else if (isCorrectAnswer) {
                                Text("✓", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ResultScreen(
    result: Screen.Result,
    prefsManager: PreferencesManager,
    onRestart: () -> Unit,
    onSelectAnotherLevel: () -> Unit,
    onGoHome: () -> Unit
) {
    var playerName by remember { mutableStateOf("") }
    var isScoreSaved by remember { mutableStateOf(false) }
    val percentage = (result.score * 100) / 200

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterAlignmentHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterAlignmentHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "🏆", fontSize = 64.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "أحسنت!",
                fontSize = 28.sp,
                fontWeight = FontWeight.ExtraBold,
                color = GoldAccent
            )
            Text(
                text = "انتهت المسابقة",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = TextLight
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Score Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterAlignmentHorizontally
                ) {
                    Text(
                        text = "النقاط: ${result.score} / 200",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = GoldAccent
                    )

                    Divider(modifier = Modifier.padding(vertical = 14.dp), color = NavySecondary)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Column(horizontalAlignment = Alignment.CenterAlignmentHorizontally) {
                            Text("الإجابات الصحيحة", fontSize = 13.sp, color = TextMuted)
                            Text("${result.correctCount}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = SuccessGreen)
                        }
                        Column(horizontalAlignment = Alignment.CenterAlignmentHorizontally) {
                            Text("الإجابات الخاطئة", fontSize = 13.sp, color = TextMuted)
                            Text("${result.wrongCount}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = ErrorRed)
                        }
                        Column(horizontalAlignment = Alignment.CenterAlignmentHorizontally) {
                            Text("النسبة", fontSize = 13.sp, color = TextMuted)
                            Text("$percentage%", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextLight)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Save to Leaderboard Form
            if (!isScoreSaved) {
                OutlinedTextField(
                    value = playerName,
                    onValueChange = { playerName = it },
                    label = { Text("أدخل اسمك لتسجيل نتيجتك في لوحة الأبطال") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = {
                        val name = playerName.trim().ifEmpty { "متسابق متميز" }
                        prefsManager.saveLeaderboardEntry(
                            LeaderboardEntry(
                                id = UUID.randomUUID().toString(),
                                playerName = name,
                                score = result.score,
                                levelTitle = result.level.titleArabic,
                                correctCount = result.correctCount,
                                wrongCount = result.wrongCount,
                                timestamp = System.currentTimeMillis()
                            )
                        )
                        isScoreSaved = true
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GoldDark)
                ) {
                    Text("🏅 حفظ في لوحة الأبطال", fontWeight = FontWeight.Bold)
                }
            } else {
                Text(
                    text = "✓ تم تسجيل نتيجتك بنجاح في لوحة الأبطال!",
                    color = SuccessGreen,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }

        // Action Buttons
        Column(
            modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Button(
                onClick = onRestart,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
            ) {
                Text("إعادة المسابقة", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            OutlinedButton(
                onClick = onSelectAnotherLevel,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("اختيار مستوى آخر", fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
            }
            TextButton(
                onClick = onGoHome,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("الرئيسية", fontSize = 15.sp, color = TextMuted)
            }
        }
    }
}

@Composable
fun LeaderboardScreen(
    prefsManager: PreferencesManager,
    onBack: () -> Unit
) {
    val entries = remember { prefsManager.getLeaderboard() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
            }
            Text(
                text = "🏅 لوحة الأبطال",
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = GoldAccent
            )
            Spacer(modifier = Modifier.size(48.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (entries.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "لا توجد نتائج مسجلة بعد.\nكن أول بطل يسجل اسمه!",
                    textAlign = TextAlign.Center,
                    color = TextMuted,
                    fontSize = 16.sp
                )
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                itemsIndexed(entries) { index, item ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = when (index) {
                                        0 -> "🥇"
                                        1 -> "🥈"
                                        2 -> "🥉"
                                        else -> "#${index + 1}"
                                    },
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.width(36.dp)
                                )
                                Column {
                                    Text(
                                        text = item.playerName,
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextLight
                                    )
                                    Text(
                                        text = item.levelTitle,
                                        fontSize = 12.sp,
                                        color = TextMuted
                                    )
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "${item.score} نقطة",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = GoldAccent
                                )
                                Text(
                                    text = "${item.correctCount} صح / ${item.wrongCount} خطأ",
                                    fontSize = 11.sp,
                                    color = TextMuted
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SettingsScreen(
    currentTheme: AppThemeSetting,
    currentFontSize: FontSizeSetting,
    isMusicOn: Boolean,
    onThemeChange: (AppThemeSetting) -> Unit,
    onFontSizeChange: (FontSizeSetting) -> Unit,
    onMusicToggle: (Boolean) -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
            }
            Text(
                text = "⚙ الإعدادات",
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                color = TextLight
            )
            Spacer(modifier = Modifier.size(48.dp))
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 1. Theme Option
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("🎨 الثيم", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextLight)
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        AppThemeSetting.NAVY_BLUE to "أزرق كحلي",
                        AppThemeSetting.DARK to "داكن",
                        AppThemeSetting.LIGHT to "فاتح"
                    ).forEach { (theme, label) ->
                        Button(
                            onClick = { onThemeChange(theme) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (currentTheme == theme) GoldDark else NavySecondary
                            )
                        ) {
                            Text(label, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 2. Font Size Option
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("🔤 حجم الخط", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextLight)
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        FontSizeSetting.SMALL to "صغير",
                        FontSizeSetting.MEDIUM to "متوسط",
                        FontSizeSetting.LARGE to "كبير"
                    ).forEach { (size, label) ->
                        Button(
                            onClick = { onFontSizeChange(size) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (currentFontSize == size) GoldDark else NavySecondary
                            )
                        ) {
                            Text(label, fontSize = 13.sp)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 3. Language Option
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("🌐 اللغة", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextLight)
                    Text("اللغة الحالية: العربية", fontSize = 12.sp, color = TextMuted)
                }
                Text("العربية (افتراضي)", fontSize = 14.sp, color = GoldAccent, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 4. Music Option
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SurfaceDark)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("♫ الموسيقى", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextLight)
                    Text(
                        if (isMusicOn) "مفعلة أثناء الاختبار" else "متوقفة",
                        fontSize = 12.sp,
                        color = TextMuted
                    )
                }
                Switch(
                    checked = isMusicOn,
                    onCheckedChange = onMusicToggle,
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = GoldAccent,
                        checkedTrackColor = GoldDark.copy(alpha = 0.5f)
                    )
                )
            }
        }
    }
}

@Composable
fun AboutScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterAlignmentHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            horizontalAlignment = Alignment.CenterAlignmentHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
                }
                Text(
                    text = "ℹ حول البرنامج",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = TextLight
                )
                Spacer(modifier = Modifier.size(48.dp))
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text("🏆", fontSize = 60.sp)

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "مسابقات الأستاذ نواف المتيوتي",
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold,
                color = GoldAccent,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(20.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceDark)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "هذا البرنامج من تصميم الأستاذ نواف المتيوتي",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "تطبيق مسابقات تعليمي وترفيهي لنظام Android.",
                        fontSize = 15.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Center
                    )

                    Divider(modifier = Modifier.padding(vertical = 16.dp), color = NavySecondary)

                    val features = listOf(
                        "20 سؤالًا",
                        "3 مستويات",
                        "مؤقت 30 ثانية",
                        "نظام نقاط",
                        "مؤثرات صوتية",
                        "موسيقى خلفية"
                    )

                    features.forEach { feature ->
                        Text(
                            text = "• $feature",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium,
                            color = TextLight,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }

        Column(
            modifier = Modifier.fillMaxWidth().padding(top = 20.dp),
            horizontalAlignment = Alignment.CenterAlignmentHorizontally
        ) {
            Text(
                text = "الإصدار 1.0.0 (API 26 - 36)",
                fontSize = 12.sp,
                color = TextMuted
            )
            Text(
                text = "com.nawaf.almutayouti.quiz",
                fontSize = 11.sp,
                color = TextMuted.copy(alpha = 0.6f)
            )
        }
    }
}
