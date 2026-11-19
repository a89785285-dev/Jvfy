# نشر خادم GODMODE على Vercel

هذا الدليل ينشر **خادم API فقط**. تطبيق Android يبقى مبنياً عبر Expo/EAS.

## 1. استيراد المشروع من GitHub

1. افتح https://vercel.com/new وسجّل الدخول باستخدام GitHub.
2. استورد المستودع `a89785285-dev/Jvfy`.
3. اختر الفرع `prompt-forge/inspect-source`.
4. في إعداد **Root Directory** اختر:
   `source-extracted/godmodeapp`
5. اترك إعدادات Build وOutput على القيم الافتراضية. لا تضف Rewrite أو Build Command يدوياً؛ ملف `server.ts` في جذر مجلد التطبيق هو نقطة دخول Express التي يتعرف عليها Vercel.
6. اضغط Deploy.

مرجع Vercel: https://vercel.com/docs/frameworks/backend/express

## 2. إعداد أسرار AI على Vercel

بعد إنشاء المشروع، افتح **Settings → Environment Variables** وأضف:

| Name | Value |
|---|---|
| `AI_API_BASE_URL` | `https://api.openai.com` |
| `AI_MODEL` | `gpt-6-luna` |
| `AI_API_KEY` | مفتاح API السري من مزود الذكاء الاصطناعي |

أضف المتغيرات إلى بيئة Production (وأي بيئة Preview ستختبرها). احفظ المفتاح في خانة Vercel السرية فقط؛ لا تضفه إلى GitHub أو ملفات المشروع أو EAS أو أي متغير يبدأ بـ `EXPO_PUBLIC_`. بعد حفظ المتغيرات أعد نشر المشروع من Deployments.

## 3. اختبار الخادم

انسخ نطاق المشروع الذي ينتهي بـ `.vercel.app` وافتح:

`https://YOUR-PROJECT.vercel.app/api/health`

يجب أن يعيد الخادم HTTP 200 وJSON يحتوي على `"ok":true`.

## 4. ربط تطبيق Android بالخادم

بعد نجاح اختبار الصحة:

1. افتح مشروع GODMODE في Expo/EAS.
2. افتح Environment Variables.
3. أضف `EXPO_PUBLIC_API_BASE_URL` كقيمة نصية غير سرية، واجعل قيمتها نطاق Vercel فقط، مثل `https://YOUR-PROJECT.vercel.app` دون `/api/trpc` ودون شرطة أخيرة.
4. أضفه إلى بيئتي `preview` و`production`.
5. شغّل GitHub Actions workflow باسم **Build GODMODE Android APK** على الفرع `prompt-forge/inspect-source` بعد إعداد عنوان الخادم.

لا تضع `AI_API_KEY` في EAS مطلقاً. التطبيق يحتاج إلى عنوان الخادم العام فقط.

## ملاحظات وحدود

- Vercel يشغّل Express كـ Function؛ لا تشغّل `server.listen()` في نقطة الدخول السحابية. يبقى التشغيل المستقل متاحاً عبر `pnpm start:server` و`pnpm build` لأغراض التطوير أو الاستضافة التقليدية.
- حد الطلبات الحالي (8 طلبات لكل IP خلال 60 ثانية) محفوظ في ذاكرة نسخة الخادم؛ هو حماية أولية لكل نسخة وليس حصة عالمية دائمة.
- قيود حجم الطلبات ومدة تنفيذ Functions لدى Vercel تظل سارية حتى لو كان Express يسمح بجسم طلب أكبر.
- تكامل Manus OAuth وتسجيل الدخول منفصل عن إعداد AI، ولن يعمل إلا بعد إعداد متغيراته وتسجيل التطبيق لدى مزود OAuth.
- استخدام مزود AI قد يترتب عليه رسوم. اطلب مساعدة ولي أمرك في الحساب والفوترة وحدود الإنفاق. لا تفترض أن الخطة المجانية تعني عدم وجود أي متطلبات تحقق أو قيود استخدام.
