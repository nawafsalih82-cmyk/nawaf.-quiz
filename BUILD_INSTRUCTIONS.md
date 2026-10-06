# دليل بناء تطبيق أندرويد وتوليد ملف APK

## مسابقات الأستاذ نواف المتيوتي
- **معرف الحزمة (Application ID)**: `com.nawaf.almutayouti.quiz`
- **الحد الأدنى للنظام (Min SDK)**: `26` (Android 8.0 Oreo)
- **الإصدار المستهدف (Target SDK)**: `36`
- **إصدار جافا (Java)**: `17`
- **Gradle**: `9.3.1`
- **Android Gradle Plugin (AGP)**: `9.1.1`

---

## خطوات بناء ملف APK (`app-debug.apk`):

### الطريقة الأولى: عبر سطر الأوامر (Terminal / Command Prompt)
1. تأكد من توفر **Java 17** و **Android SDK**.
2. قم بتنفيذ الأمر التالي في المجلد الرئيسي:
   ```bash
   ./gradlew assembleDebug
   ```
   أو في نظام ويندوز (Windows):
   ```cmd
   gradlew.bat assembleDebug
   ```
3. ستجد ملف الـ APK الجاهز للتثبيت في المسار:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

### الطريقة الثانية: عبر Android Studio
1. افتح برنامج **Android Studio Ladybug / Meerkat** (أو أحدث).
2. اختر **Open** ثم حدد مجلد المشروع هذا.
3. انتظر اكتمال مزامنة الـ Gradle (Gradle Sync).
4. من القائمة العلوية اختر:
   `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`.
5. سيتم توليد ملف `app-debug.apk` فوراً مع إمكانية تشغيله مباشرة على أي جهاز أندرويد حقيقي أو محاكي (Emulator).
