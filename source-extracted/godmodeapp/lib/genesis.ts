export type GenesisTaskStatus = "pending" | "in_progress" | "done";
export type GenesisProjectType = "mobile" | "web" | "ai" | "game" | "general";

export type GenesisAgent = {
  id: string;
  name: string;
  specialty: string;
  mission: string;
  color: string;
};

export type GenesisTask = {
  id: string;
  title: string;
  detail: string;
  agentId: string;
  phase: number;
  status: GenesisTaskStatus;
  deliverable: string;
};

export type GenesisPhase = {
  id: number;
  title: string;
  objective: string;
  taskIds: string[];
};

export type GenesisPlan = {
  id: string;
  brief: string;
  projectName: string;
  projectType: GenesisProjectType;
  createdAt: string;
  architecture: string[];
  modules: string[];
  technicalConsiderations: string[];
  agents: GenesisAgent[];
  phases: GenesisPhase[];
  tasks: GenesisTask[];
  risks: string[];
  acceptanceCriteria: string[];
  nextStep: string;
};

export const GENESIS_AGENTS: GenesisAgent[] = [
  { id: "architect", name: "ARCHITECT", specialty: "Product & system design", mission: "Turns the idea into a clear scope, architecture, and technical decisions.", color: "#65b7ff" },
  { id: "research", name: "RESEARCHER", specialty: "Discovery & requirements", mission: "Identifies users, constraints, assumptions, and comparable solutions.", color: "#a78bfa" },
  { id: "experience", name: "EXPERIENCE", specialty: "UX & interaction design", mission: "Maps user journeys, screens, states, and accessibility needs.", color: "#55d6c2" },
  { id: "builder", name: "BUILDER", specialty: "Implementation planning", mission: "Breaks architecture into small, verifiable implementation deliverables.", color: "#f6c85f" },
  { id: "sentinel", name: "SENTINEL", specialty: "Quality, privacy & security", mission: "Defines validation, threat checks, privacy boundaries, and recovery behavior.", color: "#ff8b9b" },
  { id: "release", name: "RELEASE", specialty: "Delivery & operations", mission: "Plans packaging, documentation, rollout, and post-release monitoring.", color: "#66d99a" },
];

const contains = (text: string, words: string[]) => words.some((word) => text.includes(word));

function classifyProject(brief: string): GenesisProjectType {
  const text = brief.toLowerCase();
  if (contains(text, ["لعبة", "game", "gaming", "unity", "unreal"])) return "game";
  if (contains(text, ["ذكاء اصطناعي", "ai ", " ai", "agent", "agents", "نموذج", "روبوت", "chatbot", "llm"])) return "ai";
  if (contains(text, ["موقع", "website", "web app", "ويب", "متجر إلكتروني"])) return "web";
  if (contains(text, ["تطبيق", "app", "mobile", "android", "ios", "هاتف"])) return "mobile";
  return "general";
}

function detectProjectModules(type: GenesisProjectType, brief: string): string[] {
  const text = brief.toLowerCase();
  const modules: string[] = [];
  const add = (label: string, keywords: string[]) => {
    if (contains(text, keywords)) modules.push(label);
  };

  if (type === "mobile") modules.push("تطبيق الهاتف والتنقل", "التخزين المحلي وإدارة حالة التطبيق");
  if (type === "web") modules.push("واجهة ويب متجاوبة", "إدارة الجلسات وواجهات API");
  if (type === "ai") modules.push("منسّق الوكلاء والمهام", "موصلات مزودي النماذج", "تقييم مخرجات الذكاء الاصطناعي");
  if (type === "game") modules.push("حلقة اللعب والتحكم", "إدارة المشاهد والأصول", "الحفظ والتقدم داخل اللعبة");

  add("تسجيل الدخول وإدارة الحسابات", ["تسجيل الدخول", "حساب", "مصادقة", "login", "authentication", "auth"]);
  add("المحادثات والرسائل الفورية", ["مراسلة", "محادث", "رسائل", "chat", "messaging", "real-time", "realtime"]);
  add("مشاركة الملفات والوسائط", ["ملفات", "صور", "فيديو", "مرفقات", "upload", "file sharing", "media"]);
  add("الإشعارات والتنبيهات", ["إشعارات", "تنبيهات", "notifications", "push"]);
  add("الدفع والاشتراكات", ["دفع", "مدفوعات", "اشتراك", "شراء", "payment", "subscription", "checkout"]);
  add("البحث والفهرسة", ["بحث", "محرك بحث", "search", "indexing"]);
  add("المزامنة والعمل دون اتصال", ["دون إنترنت", "بدون إنترنت", "ضعف الإنترنت", "offline", "sync", "synchronization"]);
  add("لوحة الإدارة والصلاحيات", ["لوحة إدارة", "مدير", "صلاحيات", "roles", "admin"]);
  add("التحليلات والتقارير", ["تحليلات", "إحصائيات", "تقارير", "analytics", "reports"]);
  add("الأمان وحماية البيانات", ["تشفير", "خصوصية", "أمان", "security", "encryption", "privacy"]);

  return [...new Set(modules)];
}

function technicalConsiderationsFor(type: GenesisProjectType, brief: string): string[] {
  const text = brief.toLowerCase();
  const notes = type === "mobile"
    ? ["اختبار اختلاف أحجام الشاشات وإصدارات Android", "التعامل مع أذونات الجهاز وحالات انقطاع الشبكة"]
    : type === "web"
      ? ["حماية الجلسات وواجهات API", "اختبار المتصفحات والتصميم المتجاوب"]
      : type === "ai"
        ? ["عزل مفاتيح المزودين على الخادم وعدم تضمينها في التطبيق", "قياس جودة المخرجات والتكلفة وزمن الاستجابة"]
        : type === "game"
          ? ["قياس معدل الإطارات واستهلاك الذاكرة على الأجهزة المستهدفة", "اختبار الحفظ والاستعادة وتوازن الأداء"]
          : ["تحديد حدود النظام والاعتماديات قبل اختيار التقنيات"];

  if (contains(text, ["تشفير", "encryption", "خصوصية", "privacy"])) notes.push("تحديد نموذج التهديد وإدارة المفاتيح وعدم الادعاء بتشفير طرفي دون تصميمه واختباره");
  if (contains(text, ["مراسلة", "محادث", "رسائل", "chat", "real-time", "realtime"])) notes.push("تصميم ترتيب الرسائل وإعادة المحاولة ومنع التكرار عند ضعف الاتصال");
  if (contains(text, ["ملفات", "صور", "فيديو", "upload", "file sharing"])) notes.push("التحقق من نوع الملفات وحجمها وصلاحيات الوصول وسياسة الاحتفاظ");
  if (contains(text, ["دون إنترنت", "بدون إنترنت", "offline", "sync"])) notes.push("حل تعارضات المزامنة وتحديد مصدر الحقيقة عند عودة الاتصال");
  if (contains(text, ["دفع", "مدفوعات", "اشتراك", "payment", "subscription"])) notes.push("عدم تخزين بيانات البطاقات الحساسة والتحقق من إشعارات الدفع على الخادم");
  return [...new Set(notes)];
}

function architectureFor(type: GenesisProjectType): string[] {
  const common = ["واجهة وتجربة مستخدم", "طبقة منطق الأعمال والخدمات", "طبقة بيانات وتخزين", "الاختبارات والمراقبة والتوثيق"];
  if (type === "mobile") return ["تطبيق الهاتف (Expo + React Native)", "خدمات API آمنة عند الحاجة", "تخزين محلي مع مزامنة اختيارية", ...common.slice(2)];
  if (type === "web") return ["واجهة ويب متجاوبة", "خادم API وطبقة مصادقة", "قاعدة بيانات وتخزين ملفات", "الاختبارات والأمان والمراقبة"];
  if (type === "ai") return ["واجهة المحادثة وإدارة المشاريع", "منسّق المهام والوكلاء (Orchestrator)", "موصلات مزودي النماذج مع إدارة الأسرار", "ذاكرة معرفة واسترجاع موثق", "طبقة تقييم وحواجز أمان ومراقبة"];
  if (type === "game") return ["محرك اللعبة والمشهد الأساسي", "نظام اللعب والحركة والتفاعل", "الأصول والصوت والحفظ", "اختبارات الأداء والتوافق"];
  return common;
}

export function generateGenesisPlan(rawBrief: string, now = new Date()): GenesisPlan {
  const brief = rawBrief.trim().replace(/\s+/g, " ");
  if (brief.length < 12) throw new Error("اكتب وصفاً من 12 حرفاً على الأقل حتى أستطيع بناء خطة مفيدة.");
  const projectType = classifyProject(brief);
  const projectName = brief.length > 48 ? `${brief.slice(0, 45).trim()}…` : brief;
  const definitions = [
    { phase: 1, title: "DISCOVERY", objective: "تحويل الفكرة إلى متطلبات واضحة وحدود قابلة للقياس.", tasks: [
      ["research", "تحديد المستخدمين والمشكلة الأساسية", "شخصيات مستخدمين واحتياجات موثقة"],
      ["architect", "تحديد نطاق الإصدار الأول وما لن يشمله", "وثيقة نطاق ومعايير نجاح"],
      ["research", "توثيق الافتراضات والقيود والاعتماديات", "سجل افتراضات ومخاطر أولي"],
    ]},
    { phase: 2, title: "SYSTEM DESIGN", objective: "تصميم البنية وتدفق البيانات قبل كتابة الكود.", tasks: [
      ["architect", "رسم معمارية النظام وحدود مكوناته", "مخطط مكونات وتدفقات بيانات"],
      ["experience", "تصميم رحلات المستخدم والشاشات والحالات", "خريطة تنقل وحالات الواجهة"],
      ["sentinel", "تحديد نموذج البيانات والخصوصية والصلاحيات", "مخطط بيانات وحدود وصول"],
    ]},
    { phase: 3, title: "FOUNDATION", objective: "تجهيز الأساس التقني القابل للتوسع والاختبار.", tasks: [
      ["builder", "تهيئة هيكل المشروع وبيئات التطوير", "هيكل مشروع قابل للتشغيل"],
      ["builder", "تنفيذ النواة والخدمات الأساسية", "مسارات أساسية تعمل"],
      ["sentinel", "إضافة معالجة الأخطاء والتحقق من المدخلات", "سلوك فشل آمن واختبارات أولية"],
    ]},
    { phase: 4, title: "CORE FEATURES", objective: "بناء الوظائف الرئيسية وربطها في تجربة واحدة.", tasks: [
      ["builder", "تنفيذ أهم تدفق استخدام من البداية للنهاية", "ميزة أساسية مكتملة"],
      ["experience", "إكمال الواجهة وحالات التحميل والفراغ والخطأ", "واجهات متسقة لكل الحالات"],
      ["architect", "مراجعة التكاملات والأداء وحدود التوسع", "مراجعة معمارية موثقة"],
    ]},
    { phase: 5, title: "VALIDATION", objective: "إثبات أن النظام يعمل كما هو متوقع ويصمد أمام الحالات غير المعتادة.", tasks: [
      ["sentinel", "بناء اختبارات الوحدة والتكامل والقبول", "نتائج اختبارات قابلة للتكرار"],
      ["sentinel", "مراجعة الخصوصية والأمان وإمكانية الاستعادة", "قائمة فحوصات ومعالجة المخاطر"],
      ["research", "اختبار قابلية الاستخدام مع سيناريوهات واقعية", "ملاحظات وتحسينات مرتبة"],
    ]},
    { phase: 6, title: "DELIVERY", objective: "إعداد إصدار يمكن تثبيته وصيانته ومتابعة جودته.", tasks: [
      ["release", "إعداد البناء والتغليف وإدارة الإصدارات", "حزمة إصدار موثقة"],
      ["release", "كتابة دليل الاستخدام والتشغيل والتسليم", "وثائق تشغيل وتسليم"],
      ["release", "تحديد مراقبة ما بعد الإطلاق وخطة التراجع", "خطة متابعة واستجابة"],
    ]},
  ];

  let taskNumber = 0;
  const tasks: GenesisTask[] = definitions.flatMap((phase) => phase.tasks.map(([agentId, title, deliverable]) => ({
    id: `task-${++taskNumber}`,
    title: title as string,
    detail: `ينفّذ وكيل ${GENESIS_AGENTS.find((agent) => agent.id === agentId)?.name} هذه المهمة ضمن المرحلة ${phase.title}، مع توثيق القرار والنتيجة قبل الانتقال.`,
    agentId: agentId as string,
    phase: phase.phase,
    status: "pending" as const,
    deliverable: deliverable as string,
  })));

  const phases: GenesisPhase[] = definitions.map((phase) => ({
    id: phase.phase,
    title: phase.title,
    objective: phase.objective,
    taskIds: tasks.filter((task) => task.phase === phase.phase).map((task) => task.id),
  }));

  const modules = detectProjectModules(projectType, brief);
  const technicalConsiderations = technicalConsiderationsFor(projectType, brief);
  const text = brief.toLowerCase();
  const risks = [
    "اتساع نطاق الفكرة قبل إثبات قيمة الإصدار الأول؛ نعالج ذلك بتحديد MVP واضح.",
    "الاعتماد على خدمات خارجية أو مفاتيح API؛ يجب حفظ الأسرار على الخادم وعدم تضمينها في التطبيق.",
    "تراكم المهام دون اختبارات؛ لا تنتقل المرحلة قبل التحقق من مخرجاتها.",
    ...(projectType === "ai" ? ["قد تنتج النماذج إجابات غير دقيقة؛ نحتاج تقييم النتائج ومراجعة بشرية للقرارات المهمة."] : []),
    ...(contains(text, ["تشفير", "encryption", "خصوصية", "privacy"]) ? ["التشفير غير المصمم جيداً قد يعطي إحساساً زائفاً بالأمان؛ يلزم نموذج تهديد ومراجعة مستقلة."] : []),
    ...(contains(text, ["مراسلة", "محادث", "رسائل", "chat", "real-time", "realtime"]) ? ["قد تتكرر الرسائل أو يختل ترتيبها عند انقطاع الاتصال؛ يلزم اختبار إعادة المحاولة والمزامنة."] : []),
    ...(contains(text, ["دفع", "مدفوعات", "اشتراك", "payment", "subscription"]) ? ["أخطاء تأكيد الدفع أو تكرار الطلب قد تسبب معاملات غير صحيحة؛ يلزم تحقق خادمي ومعرّفات idempotency."] : []),
  ];

  const acceptanceCriteria = [
    "يمكن تشغيل المسار الأساسي للمشروع من البداية إلى النهاية.",
    "لكل ميزة رئيسية اختبار أو طريقة تحقق واضحة.",
    "تظهر حالات التحميل والنجاح والخطأ والبيانات الفارغة بصورة مفهومة.",
    "لا تُكشف الأسرار أو البيانات الخاصة في السجلات أو التطبيق.",
    "توجد تعليمات تشغيل وبناء وتسليم قابلة لإعادة التنفيذ.",
  ];

  return {
    id: `genesis-${now.getTime()}`,
    brief,
    projectName,
    projectType,
    createdAt: now.toISOString(),
    architecture: architectureFor(projectType),
    modules,
    technicalConsiderations,
    agents: GENESIS_AGENTS,
    phases,
    tasks,
    risks,
    acceptanceCriteria,
    nextStep: "راجع نطاق الإصدار الأول، ثم ابدأ بمهام DISCOVERY قبل كتابة الكود.",
  };
}

export function getGenesisProgress(tasks: GenesisTask[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
}

export function advanceGenesisTask(tasks: GenesisTask[], taskId: string): GenesisTask[] {
  const next: Record<GenesisTaskStatus, GenesisTaskStatus> = {
    pending: "in_progress",
    in_progress: "done",
    done: "pending",
  };
  return tasks.map((task) => task.id === taskId ? { ...task, status: next[task.status] } : task);
}
