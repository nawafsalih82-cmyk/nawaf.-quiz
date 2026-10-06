package com.nawaf.almutayouti.quiz.model

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

enum class AppThemeSetting {
    NAVY_BLUE,
    DARK,
    LIGHT
}

enum class FontSizeSetting {
    SMALL,
    MEDIUM,
    LARGE
}
