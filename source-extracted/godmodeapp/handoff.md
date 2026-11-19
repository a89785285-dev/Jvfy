# Handoff — GODMODE Mobile

## الهدف
تطوير التطبيق الحالي وإتاحة بناء APK دون الاعتماد على رصيد EAS، مع الحفاظ على العمل على الفرع `prompt-forge/inspect-source` وعدم تعديل `main`.

## أين وصلت
- تم تجهيز workflow لبناء APK مباشرةً على GitHub Actions باستخدام Expo Prebuild وAndroid Gradle.
- تم إزالة اعتماد workflow الخاص بـ GODMODE على EAS CLI و`EXPO_TOKEN`.
- المحاولة الأولى وصلت إلى إعداد Android SDK ثم توقفت عند طلب قبول تراخيص SDK بشكل تفاعلي.
- المحاولة التالية كشفت أن `android-actions/setup-android@v3` يفشل عند طلب حزمة قديمة `tools` غير متاحة في مستودع SDK (`Failed to find package 'tools'`).
- تمت إزالة هذا الإجراء والانتقال إلى Android SDK المثبّت مسبقًا على GitHub runner، مع ضبط PATH وقبول التراخيص وتثبيت platform-tools وAndroid API 36 وBuild Tools 36.0.0 مباشرةً.
- لم يتم تأكيد نجاح بناء APK بعد؛ يجب مراجعة تشغيل workflow الجديد وartifact الناتج.

## الملفات التي تعمل عليها
- `.github/workflows/build-godmode-apk.yml`
- `source-extracted/godmodeapp/README.md`
- `source-extracted/godmodeapp/APK_BUILD.md`
- `source-extracted/godmodeapp/handoff.md`

## التعديلات التي صارت
- إعداد Node.js 22 وpnpm 9.12 وJava 17 وAndroid SDK على GitHub Actions.
- إزالة `android-actions/setup-android@v3` لأنه يستدعي تثبيت الحزمة القديمة `tools` التي لم تعد متاحة.
- إضافة خطوة تستخدم Android SDK الموجود مسبقًا على GitHub runner، وتضيف command-line tools وplatform-tools إلى PATH، ثم تثبّت Android API 36 وBuild Tools 36.0.0.
- تثبيت الاعتماديات من lockfile دون تغييره.
- توليد مشروع Android بواسطة `expo prebuild --platform android --no-install --clean`.
- بناء APK عبر `./gradlew --no-daemon --stacktrace assembleRelease`.
- التحقق من ملف APK ورفعه كـ artifact باسم `GODMODE-Mobile-Android-APK` لمدة 14 يومًا.
- APK مبني بالإعداد الافتراضي debug signing؛ مناسب للاختبار وليس توقيع إصدار Google Play.

## المحاولات التي فشلت
- بناء EAS توقف لأن حساب Expo استنفد حصة Android المجانية حتى موعد إعادة التعيين.
- workflow السابق في GitHub كان يستدعي EAS أيضًا، ولذلك لم يكن بديلًا فعليًا.
- أول تشغيل لبناء GitHub Actions توقف عند مطالبة قبول 7 تراخيص Android SDK بصورة تفاعلية.
- التشغيل التالي فشل داخل `android-actions/setup-android@v3` برسالة `Failed to find package 'tools'`؛ لم يصل إلى تثبيت الاعتماديات أو توليد Android.
- فشل فحص TypeScript في تشغيل تحقق سابق بسبب أخطاء موجودة في `lib/semantic-detection.ts` و`server/godmode.ts`. يجب مراجعتها بشكل منفصل.

## الخطوة القادمة
- مراجعة تشغيل **Build GODMODE Android APK** بعد إزالة action المعطوب والتحول إلى SDK المثبّت مسبقًا.
- إذا فشل، مراجعة أول خطوة حمراء وإصلاح سببها.
- إذا نجح، تنزيل artifact وتجربة تثبيته على جهاز Android.
- معالجة أخطاء TypeScript المذكورة وتشغيل الاختبارات قبل اعتبار التحقق البرمجي مكتملًا.
