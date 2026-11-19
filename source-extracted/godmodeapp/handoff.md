# Handoff — GODMODE Mobile

## الهدف
تطوير تطبيق GODMODE Mobile الحالي على الفرع `prompt-forge/inspect-source`، وعدم تعديل `main` أو دمج التغييرات إليه دون طلب صريح. الأولوية لبناء أنظمة حقيقية قابلة للاختبار، وليس واجهات شكلية.

## أين وصلت
- تم بناء GODMODE GENESIS كأول نواة لتخطيط المشاريع.
- GENESIS يستقبل وصف الفكرة محلياً، ويصنف نوع المشروع، وينتج معمارية أولية، وست مراحل تنفيذ، و18 مهمة، وستة أدوار تخصصية، وسجل مخاطر ومعايير قبول.
- يمكن متابعة حالة كل مهمة بين pending وin_progress وdone، وحفظ آخر خطة محلياً باستخدام AsyncStorage.
- تمت إضافة شاشة GENESIS وربطها بلوحة Dashboard.
- تم إصلاح عدم توافق نوعي في server/godmode.ts؛ نوع content في عقد invokeLLM نصّي، وتم الإبقاء على استيراد router وpublicProcedure من ملف tRPC.
- ملاحظة صريحة: النسخة الحالية محرك تخطيط محلي قائم على قواعد قابلة للتفسير؛ الأدوار ليست نماذج AI مستقلة ولا تنفذ مهام برمجية تلقائياً بعد. ربط النماذج والتنفيذ الفعلي مرحلة لاحقة.
- نجح بناء APK في GitHub Actions run `44544195446` وظهر artifact باسم `GODMODE-Mobile-Android-APK`، لكن فحص الملف بعد تنزيله كشف أنه غير موقّع؛ لذلك قد يرفضه Android برسالة تعذّر تحليل الحزمة. تمت إضافة خطوة توقيع تلقائي بمفتاح اختبار مؤقت عبر `apksigner`، وخطوة تحقق إلزامية من التوقيع قبل رفع artifact. يجب انتظار run الجديد والتأكد من نجاح `apksigner verify` قبل تسليم APK.

## الملفات التي تعمل عليها
- `source-extracted/godmodeapp/lib/genesis.ts`
- `source-extracted/godmodeapp/lib/genesis.test.ts`
- `source-extracted/godmodeapp/app/(tabs)/genesis.tsx`
- `source-extracted/godmodeapp/app/(tabs)/_layout.tsx`
- `source-extracted/godmodeapp/app/(tabs)/index.tsx`
- `source-extracted/godmodeapp/server/godmode.ts`
- `source-extracted/godmodeapp/handoff.md`

## التعديلات التي صارت
- إضافة مولّد مخطط مشروع بست مراحل: Discovery, System Design, Foundation, Core Features, Validation, Delivery.
- إضافة ستة أدوار: Architect, Researcher, Experience, Builder, Sentinel, Release.
- إضافة 18 مهمة بمخرجات محددة وقابلة للتحقق.
- إضافة تصنيف أولي لأنواع المشاريع: mobile, web, ai, game, general، مع اقتراح بنية مختلفة لكل نوع.
- إضافة سجل مخاطر ومعايير قبول وخطوة تالية.
- إضافة تتبع تقدم المهام وحفظ الخطة محلياً.
- إضافة اختبارات وحدات لمحرك GENESIS.
- إصلاح عدم توافق نوعي في مخرجات محرك LLM داخل server/godmode.ts مع الحفاظ على استيرادات tRPC المطلوبة.

## المحاولات التي فشلت
- run `44544195446` نجح في إنشاء APK ورفع artifact، لكن الفحص المحلي للملف أظهر `jar is unsigned`؛ أي أن حزمة الإصدار لم تحمل توقيع APK. تم تعديل workflow لإنشاء مفتاح اختبار مؤقت وتوقيع الملف بواسطة Android `apksigner` ثم التحقق من صحة التوقيع قبل رفعه. مفتاح الاختبار مخصص للتثبيت والاختبار فقط، وليس توقيع إصدار إنتاج أو تحديثات مستمرة.
- تعذر بناء APK في run `44536644782` بعد نجاح Expo Prebuild؛ فشل Gradle أثناء تهيئة included build الخاص بـ React Native لأن Maven Central لم يُرجع عدة artifacts منشورة (Kotlin وjava-diff-utils). أضيف init script إلى workflow يضيف Google-hosted Maven Central mirror لكل project build بما فيها included builds، مع إبقاء المستودعات الأصلية كبدائل.
- تعذر فك محتوى ملفات GitHub API المشفر ضمن جلسة Code Mode لعدم توفر Buffer/atob؛ تم تجاوز ذلك بقراءة الملفات النصية من raw.githubusercontent.com.
- أول تحقق TypeScript بعد إضافة GENESIS كشف فرع array غير ممكن في نوع content؛ بعد إصلاحه كشف التحقق أن استيرادات tRPC لم تُضمّن في إعادة كتابة الملف؛ تمت إضافتها مجدداً. ثم كشف Vitest أن قاعدة P001 لا تلتقط صيغة شائعة هي Ignore all previous instructions؛ تم توسيع التعبير النمطي لتغطية هذه الصيغة.
- لا توجد نتيجة تحقق TypeScript أو Vitest لهذه الدفعة بعد الإصلاح الأخير؛ يجب عدم وصفها بأنها اجتازت الاختبارات قبل تشغيل workflow والتحقق من سجلاته.

## الخطوة القادمة
- تشغيل والتحقق من TypeScript وVitest وExpo lint عبر GitHub Actions.
- إصلاح أي أخطاء تظهر من السجلات.
- إعادة بناء APK بعد إضافة fallback لمستودع Maven Central، ثم التحقق من artifact.
- المرحلة التالية بعد استقرار GENESIS: بناء Orchestrator حقيقي يربط موفري النماذج بوكلاء متخصصين، مع موافقات بشرية قبل أي تعديل ملفات أو نشر أو إجراء خارجي، وإدارة آمنة للمفاتيح على الخادم.
