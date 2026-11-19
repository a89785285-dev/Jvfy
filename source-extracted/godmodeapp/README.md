# GODMODE Mobile

تطبيق Android مبني على Expo/React Native. تعمل أدوات Prompt Analyzer وResponse Evaluator وDataset محليًا، بينما يستخدم Prompt Studio خادم Node.js مستقلًا للاتصال بمزوّد متوافق مع OpenAI Responses API. مفتاح المزوّد محفوظ على الخادم فقط ولا يوضع داخل APK. النصوص المدخلة تعامل كبيانات غير موثوقة ولا يتم تنفيذها.

## التشغيل أثناء التطوير

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

تستخدم الوظائف المحلية AsyncStorage. يحتاج Prompt Studio إلى نشر API أولاً وضبط `AI_API_KEY` و`AI_API_BASE_URL` و`AI_MODEL` على الخادم. راجع [دليل نشر خادم AI](./docs/AI_BACKEND_DEPLOYMENT.md). لا تضع أي مفتاح API في متغيرات `EXPO_PUBLIC_*` أو في إعدادات بناء APK.

## إنتاج APK

ملف `eas.json` يحتوي profile باسم `preview` مضبوطًا على Android APK. استخدم زر **Build Android** في Dashboard لمشروع GODMODE Mobile واختر profile `preview`. بيئة Sandbox لا تنفذ Android release build، لذلك لا يُعتبر APK موجودًا قبل نجاح البناء الفعلي وظهور artifact قابل للتنزيل. التفاصيل في [APK_BUILD.md](./APK_BUILD.md).

## الشاشات

Dashboard، Prompt Analyzer، Response Evaluator، Dataset Builder، Analysis History، Settings، وAbout. الواجهة portrait داكنة بألوان navy وblue ومصممة للاستخدام بيد واحدة.
