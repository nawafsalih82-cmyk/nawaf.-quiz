package com.nawaf.almutayouti.quiz.ui.theme

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
    primary = GoldAccent,
    secondary = RoyalBlue,
    background = NavyPrimary,
    surface = SurfaceDark,
    onPrimary = NavyPrimary,
    onSecondary = TextLight,
    onBackground = TextLight,
    onSurface = TextLight
)

private val DarkColorScheme = darkColorScheme(
    primary = GoldAccent,
    secondary = Color(0xFF3B82F6),
    background = Color(0xFF0F172A),
    surface = Color(0xFF1E293B),
    onPrimary = Color(0xFF0F172A),
    onSecondary = TextLight,
    onBackground = TextLight,
    onSurface = TextLight
)

private val LightColorScheme = lightColorScheme(
    primary = RoyalBlue,
    secondary = GoldDark,
    background = Color(0xFFF1F5F9),
    surface = Color(0xFFFFFFFF),
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color(0xFF0F172A),
    onSurface = Color(0xFF0F172A)
)

@Composable
fun NawafQuizTheme(
    themeSetting: AppThemeSetting = AppThemeSetting.NAVY_BLUE,
    content: @Composable () -> Unit
) {
    val colors = when (themeSetting) {
        AppThemeSetting.LIGHT -> LightColorScheme
        AppThemeSetting.DARK -> DarkColorScheme
        AppThemeSetting.NAVY_BLUE -> NavyColorScheme
    }

    MaterialTheme(
        colorScheme = colors,
        content = content
    )
}
