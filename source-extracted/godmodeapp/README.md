# GODMODE Mobile

تطبيق Android مبني على Expo/React Native يعيد تنفيذ وظائف GODMODE الأساسية على الهاتف. التطبيق يعمل محليًا افتراضيًا: يحلل prompts بإشارات pattern وheuristic، يقيّم responses بسبعة أبعاد، يحفظ dataset cases، ويشارك JSONL عبر نظام مشاركة Android. النصوص المدخلة تعامل كبيانات غير موثوقة ولا يتم تنفيذها.

## التشغيل أثناء التطوير

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

يستخدم المشروع منفذي Expo 8081 وAPI 3000 وفق قالب Mobile. الوظائف الأساسية لا تعتمد على API خارجي، وتخزينها عبر AsyncStorage. Semantic detection وOllama غير مفعّلين افتراضيًا.

## إنتاج APK

ملف `eas.json` يحتوي profile باسم `preview` مضبوطًا على Android APK. استخدم زر **Build Android** في Dashboard لمشروع GODMODE Mobile واختر profile `preview`. بيئة Sandbox لا تنفذ Android release build، لذلك لا يُعتبر APK موجودًا قبل نجاح البناء الفعلي وظهور artifact قابل للتنزيل. التفاصيل في [APK_BUILD.md](./APK_BUILD.md).

## الشاشات

Dashboard، Prompt Analyzer، Response Evaluator، Dataset Builder، Analysis History، Settings، وAbout. الواجهة portrait داكنة بألوان navy وblue ومصممة للاستخدام بيد واحدة.
