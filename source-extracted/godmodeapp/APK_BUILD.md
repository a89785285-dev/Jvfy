# Android APK Build

المشروع مهيأ لإنتاج APK عبر Expo/EAS. بيئة Sandbox تتحقق من المصدر وMetro فقط ولا تنفذ Android release build.

## من Dashboard

1. افتح مشروع **GODMODE Mobile** في Dashboard.
2. استخدم **Build Android**.
3. اختر profile: `preview` للحصول على ملف `.apk` قابل للتثبيت والاختبار.
4. انتظر نتيجة البناء ثم نزّل artifact الناتج وثبّته على جهاز Android.

ملف `eas.json` يضبط profile `preview` على `distribution: internal` و`android.buildType: apk`. لا تعتبر APK مكتملة أو قابلة للتنزيل قبل ظهور نتيجة build ناجحة فعلية من Dashboard/EAS.

## ما تم التحقق منه هنا

- `pnpm check` ناجح.
- `pnpm test -- --run` ناجح: 27 اختبارًا ناجحًا، واختبار قالب واحد متخطى.
- `pnpm db:push` ناجح ولا توجد تغييرات schema معلقة.
- Metro على 8081 أعاد HTTP 200 بعد bundling.
- API على 3000 بدأ بنجاح.

اختبار APK native على جهاز Android يبقى مطلوبًا بعد استخراج artifact.
