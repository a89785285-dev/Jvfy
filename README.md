# VANTA CODE Android — Starter

واجهة Android أولية لإدارة وعرض مكتبات Java/Kotlin، مبنية باستخدام Kotlin وJetpack Compose.

## فتح المشروع
1. فك ضغط الملف.
2. افتح مجلد `VANTA_CODE_Android` في Android Studio.
3. استخدم JDK 17.
4. وافق على Gradle Sync ثم شغّل التطبيق على جهاز Android أو محاكي.

## المكتبات المضافة
- Gson: التعامل مع JSON.
- OkHttp: اتصالات HTTP.
- Zip4j: ضغط وفك ZIP.
- JGit: وظائف Git.
- JavaPoet وKotlinPoet: توليد الشيفرات.

## ملاحظات مهمة
- زر Copy ينسخ سطر Gradle لإضافته إلى ملف `app/build.gradle.kts` في مشروعك.
- هذه نسخة تأسيسية لكتالوج المكتبات؛ لا تعدّل ملفات مشاريع خارجية ولا تبني Minecraft mods تلقائياً بعد.
- وجود مكتبة في dependencies لا يعني أن كل وظائفها مهيأة تلقائياً على Android. اختبر توافق كل مكتبة على جهازك.
- بناء مشاريع Gradle عامة أو Fabric من داخل Android يحتاج طبقة بناء منفصلة وتهيئة إضافية؛ Gradle Tooling API ليس مضمونا للعمل كمنفذ بناء داخل تطبيق Android.

## Build APK using GitHub Actions (phone-friendly)

1. Create a GitHub repository and upload the **contents** of this project folder (not the ZIP file itself).
2. Make sure `.github/workflows/build-apk.yml` is included.
3. Open the repository's **Actions** tab.
4. Select **Build VANTA CODE APK**, then tap **Run workflow** (or push to `main`).
5. Open the completed workflow run, find **Artifacts**, and download `VANTA-CODE-debug-apk`.
6. Extract the downloaded artifact ZIP to get `app-debug.apk`.

This workflow creates a debug APK for testing. It is not a Play Store release or a signed release APK.
