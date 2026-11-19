# Android APK Build

## الطريقة المعتمدة: GitHub Actions (من دون EAS)

يُنشئ GitHub Actions مشروع Android الأصلي من إعدادات Expo ثم يبني APK باستخدام Gradle. لا يحتاج هذا المسار إلى حساب EAS مدفوع أو متغير سرّي باسم `EXPO_TOKEN`.

### تشغيل البناء

1. افتح مستودع GODMODE على GitHub ثم تبويب **Actions**.
2. اختر **Build GODMODE Android APK**.
3. اختر الفرع `prompt-forge/inspect-source` ثم اضغط **Run workflow**.
4. انتظر حتى تصبح جميع خطوات التشغيل خضراء.
5. افتح التشغيل الناجح، ثم نزّل artifact باسم `GODMODE-Mobile-Android-APK`.

يمكن أيضًا تشغيله تلقائيًا عند دفع تغييرات إلى مجلد التطبيق على فرع العمل.

### ما الذي ينفذه الـ workflow؟

- تثبيت Node.js وpnpm وJava وAndroid SDK.
- تثبيت الاعتماديات باستخدام `pnpm install --frozen-lockfile`.
- توليد مجلد Android عبر `expo prebuild`.
- بناء `assembleRelease` بواسطة Gradle.
- التحقق من وجود APK ورفعه كـ artifact لمدة 14 يومًا.

### التوقيع والاستخدام

APK الناتج موقّع بمفتاح debug الافتراضي الذي ينشئه Android Gradle Plugin عند عدم إعداد مفتاح release. هذا مناسب للتثبيت والاختبار على جهاز Android، لكنه ليس توقيع إصدار إنتاجي للنشر على Google Play. لا تضع مفاتيح توقيع أو مفاتيح API داخل المستودع.

### حدود التحقق

نجاح حفظ ملف workflow لا يعني أن APK بُني بالفعل. لا يُعتبر البناء ناجحًا إلا بعد اكتمال GitHub Actions بنجاح وظهور artifact قابل للتنزيل. إذا فشل التشغيل، افحص أول خطوة حمراء وسجلاتها قبل إجراء تغييرات أخرى.
