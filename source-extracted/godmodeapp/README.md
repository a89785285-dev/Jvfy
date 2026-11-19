# GODMODE Mobile

تطبيق Android مبني على Expo/React Native. تعمل أدوات Prompt Analyzer وResponse Evaluator وDataset محليًا، بينما يستخدم Prompt Studio خادم Node.js مستقلًا للاتصال بمزوّد متوافق مع OpenAI Responses API. مفتاح المزوّد محفوظ على الخادم فقط ولا يوضع داخل APK. النصوص المدخلة تعامل كبيانات غير موثوقة ولا يتم تنفيذها.

## تشغيل الخادم أثناء التطوير

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

تستخدم الوظائف المحلية AsyncStorage. يحتاج Prompt Studio إلى نشر API أولاً وضبط `AI_API_KEY` و`AI_API_BASE_URL` و`AI_MODEL` على الخادم. راجع [دليل نشر خادم AI على Vercel](./docs/VERCEL_DEPLOYMENT.md). لا تضع أي مفتاح API في متغيرات `EXPO_PUBLIC_*` أو في إعدادات بناء APK.

## إنتاج APK عبر GitHub Actions

يُبنى APK مباشرةً على GitHub Actions دون استخدام EAS Build أو `EXPO_TOKEN`:

1. افتح تبويب **Actions** في مستودع GitHub.
2. اختر **Build GODMODE Android APK**.
3. اضغط **Run workflow** على الفرع `prompt-forge/inspect-source`.
4. بعد نجاح التشغيل، افتح التشغيل نفسه ونزّل artifact باسم `GODMODE-Mobile-Android-APK`.

يعمل الـ workflow على توليد مشروع Android بواسطة Expo Prebuild ثم تشغيل Gradle لإنتاج APK. يُوقّع APK الناتج بمفتاح debug الافتراضي، وهو مناسب للتثبيت والاختبار وليس إصدارًا إنتاجيًا للنشر على Google Play. يحتفظ GitHub بالـ artifact لمدة 14 يومًا.

## الشاشات

Dashboard، Prompt Analyzer، Response Evaluator، Dataset Builder، Analysis History، Settings، وAbout. الواجهة portrait داكنة بألوان navy وblue ومصممة للاستخدام بيد واحدة.
