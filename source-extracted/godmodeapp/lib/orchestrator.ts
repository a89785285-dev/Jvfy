import type { GenesisPlan, GenesisTask } from "./genesis";

export type RunStatus = "ready" | "running" | "paused" | "completed";
export type TaskRunStatus = "blocked" | "ready" | "running" | "awaiting_approval" | "completed" | "failed";
export type ApprovalKind = "external_write" | "publish" | "delete" | "spend";
export type OrchestratedTask = {
  id: string;
  title: string;
  agentId: string;
  phase: number;
  deliverable: string;
  dependsOn: string[];
  status: TaskRunStatus;
  requiresApproval: boolean;
  approvalKind?: ApprovalKind;
  result?: string;
};
export type OrchestrationRun = {
  id: string;
  planId: string;
  projectName: string;
  createdAt: string;
  status: RunStatus;
  tasks: OrchestratedTask[];
  events: Array<{ id: string; at: string; type: string; message: string }>;
};

const approvalPattern = /\b(deploy|publish|release|delete|remove|overwrite|charge|purchase|send email|send message)\b|نشر|إطلاق|حذف|مسح|استبدال|شراء|دفع|إرسال رسالة|إرسال بريد/i;

export function createOrchestrationRun(plan: GenesisPlan, now = new Date()): OrchestrationRun {
  const tasks: OrchestratedTask[] = plan.tasks.map((task: GenesisTask, index: number) => {
    const priorPhaseTasks = plan.tasks.filter((candidate) => candidate.phase < task.phase).map((candidate) => candidate.id);
    return {
      id: task.id,
      title: task.title,
      agentId: task.agentId,
      phase: task.phase,
      deliverable: task.deliverable,
      dependsOn: priorPhaseTasks,
      status: priorPhaseTasks.length ? "blocked" : "ready",
      requiresApproval: approvalPattern.test(`${task.title} ${task.detail} ${task.deliverable}`),
      ...(approvalPattern.test(`${task.title} ${task.detail} ${task.deliverable}`) ? { approvalKind: "external_write" as const } : {}),
    };
  });
  return {
    id: `run-${now.getTime()}`,
    planId: plan.id,
    projectName: plan.projectName,
    createdAt: now.toISOString(),
    status: "ready",
    tasks,
    events: [{ id: "event-created", at: now.toISOString(), type: "created", message: "تم إنشاء جلسة تنسيق بخطة اعتماديات وموافقات." }],
  };
}

export function getRunnableTasks(run: OrchestrationRun): OrchestratedTask[] {
  const completed = new Set(run.tasks.filter((task) => task.status === "completed").map((task) => task.id));
  return run.tasks.filter((task) => task.status === "ready" && task.dependsOn.every((id) => completed.has(id)));
}

export function startOrchestratedTask(run: OrchestrationRun, taskId: string, now = new Date()): OrchestrationRun {
  const task = run.tasks.find((item) => item.id === taskId);
  if (!task || !getRunnableTasks(run).some((item) => item.id === taskId)) throw new Error("المهمة غير جاهزة؛ أكمل اعتمادياتها أولاً.");
  if (task.requiresApproval) throw new Error("تتطلب هذه المهمة موافقة صريحة قبل التنفيذ.");
  return updateTask(run, taskId, "running", "started", "بدأ تنفيذ المهمة.");
}

export function requestTaskApproval(run: OrchestrationRun, taskId: string, now = new Date()): OrchestrationRun {
  const task = run.tasks.find((item) => item.id === taskId);
  if (!task || !getRunnableTasks(run).some((item) => item.id === taskId) || !task.requiresApproval) throw new Error("لا توجد موافقة مطلوبة لهذه المهمة أو أنها غير جاهزة.");
  return updateTask(run, taskId, "awaiting_approval", "approval_requested", "المهمة متوقفة بانتظار موافقة المستخدم.");
}

export function resolveTaskApproval(run: OrchestrationRun, taskId: string, approved: boolean, now = new Date()): OrchestrationRun {
  const task = run.tasks.find((item) => item.id === taskId);
  if (!task || task.status !== "awaiting_approval") throw new Error("لا توجد موافقة معلقة لهذه المهمة.");
  const next = updateTask(run, taskId, approved ? "running" : "failed", approved ? "approval_granted" : "approval_denied", approved ? "وافق المستخدم؛ أصبحت المهمة جاهزة للتنفيذ." : "رفض المستخدم الإجراء؛ لم يتم تنفيذه.");
  return next;
}

export function finishOrchestratedTask(run: OrchestrationRun, taskId: string, result: string, now = new Date()): OrchestrationRun {
  if (!result.trim()) throw new Error("يجب تسجيل نتيجة قابلة للمراجعة قبل إكمال المهمة.");
  const task = run.tasks.find((item) => item.id === taskId);
  if (!task || task.status !== "running") throw new Error("لا يمكن إكمال مهمة لم تبدأ.");
  const tasks = run.tasks.map((item) => item.id === taskId ? { ...item, status: "completed" as const, result: result.trim() } : item);
  const unlocked = tasks.map((item) => item.status === "blocked" && item.dependsOn.every((id) => tasks.some((candidate) => candidate.id === id && candidate.status === "completed")) ? { ...item, status: "ready" as const } : item);
  const completed = unlocked.every((item) => item.status === "completed" || item.status === "failed");
  return { ...run, tasks: unlocked, status: completed ? "completed" : "running", events: [...run.events, event("task_completed", `اكتملت المهمة: ${task.title}`, now)] };
}

function updateTask(run: OrchestrationRun, taskId: string, status: TaskRunStatus, type: string, message: string, now = new Date()): OrchestrationRun {
  return { ...run, status: "running", tasks: run.tasks.map((task) => task.id === taskId ? { ...task, status } : task), events: [...run.events, event(type, message, now)] };
}
function event(type: string, message: string, now: Date) {
  return { id: `event-${now.getTime()}-${type}`, at: now.toISOString(), type, message };
}
