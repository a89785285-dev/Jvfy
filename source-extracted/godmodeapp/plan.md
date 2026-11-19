# GODMODE Mobile — Plan

## Product direction
إعادة بناء GODMODE كتطبيق Android محلي بواجهة portrait مناسبة للاستخدام بيد واحدة. التطبيق لا ينفذ النصوص المدخلة ولا يرسلها خارجيًا افتراضيًا، ويقدم تقديرات heuristic لا تثبت نية ضارة.

## Design exploration
- **Tactical Navy Console** (0.07): لوحة داكنة عالية الكثافة تشبه أدوات QA الأمنية.
- **Midnight Observatory** (0.06): مساحات واسعة ومؤشرات خطر مضيئة تركز على القراءة الهادئة.
- **Blueprint Lab** (0.08): بطاقات تحليلية وحدود هندسية أكثر تقنية.

**الاختيار:** Tactical Navy Console. يعتمد على خلفية navy عميقة، blue accent واضح، بطاقات ذات حدود خافتة، ومؤشرات status قابلة للمسح البصري.

## Core principles
1. كل إدخال يعامل كبيانات غير موثوقة ولا يتم تنفيذه.
2. النتائج تفسيرية وقابلة للمراجعة، وليست حكمًا قطعيًا.
3. كل زر مرئي ينفذ إجراءً حقيقيًا محليًا.
4. تجربة portrait مختصرة: شريط تبويب سفلي، إجراءات سريعة، ونماذج قصيرة.

## Architecture
- `lib/godmode.ts`: محلل pattern/heuristic، evaluator deterministic، أنواع البيانات، وتخزين AsyncStorage.
- `app/(tabs)/index.tsx`: Dashboard والإحصاءات والنشاط الحديث.
- `app/(tabs)/analyzer.tsx`: إدخال وتحليل prompt وحفظ النتيجة في التاريخ.
- `app/(tabs)/evaluator.tsx`: تقييم response بدرجات 0–4 وتحذيرات.
- `app/(tabs)/dataset.tsx`: إنشاء dataset cases والتحقق وكشف التكرار وتصدير JSONL.
- `app/(tabs)/history.tsx`: سجل التحليلات والتقييمات.
- `app/(tabs)/settings.tsx`: إعدادات محلية وحالة optional modules.
- `app/(tabs)/about.tsx`: حدود التطبيق ومعلومات السلامة.

## Native/build scope
سيظل المشروع على قالب Expo/React Native/TypeScript الثابت. التخزين محلي ولا يعتمد على API خارجي. إعدادات Android والهوية الأصلية الموجودة في `app.config.ts` محفوظة، مع تحديث اسم التطبيق والأيقونات/الألوان إن لزم. إصدار APK النهائي يتطلب نجاح عملية بناء Android من Dashboard/EAS؛ تشغيل Expo Web لا يثبت وجود APK.
