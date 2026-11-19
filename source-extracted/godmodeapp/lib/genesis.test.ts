import { describe, expect, it } from "vitest";
import { advanceGenesisTask, generateGenesisPlan, getGenesisProgress } from "./genesis";

describe("GODMODE GENESIS planner", () => {
  it("creates a six-phase plan with specialist agents", () => {
    const plan = generateGenesisPlan("أريد بناء تطبيق لإدارة المشاريع على أندرويد", new Date("2026-11-19T12:00:00Z"));
    expect(plan.projectType).toBe("mobile");
    expect(plan.phases).toHaveLength(6);
    expect(plan.agents.length).toBeGreaterThanOrEqual(5);
    expect(plan.tasks).toHaveLength(18);
  });

  it("selects an AI architecture for AI projects", () => {
    const plan = generateGenesisPlan("Build an AI agent platform with multiple agents");
    expect(plan.projectType).toBe("ai");
    expect(plan.architecture).toContain("منسّق المهام والوكلاء (Orchestrator)");
  });

  it("tailors modules and engineering risks to the requested product", () => {
    const plan = generateGenesisPlan("أريد تطبيق مراسلة فورية يدعم المحادثات الخاصة والمجموعات ومشاركة الصور وتشفير المحادثات والإشعارات والعمل دون إنترنت");
    expect(plan.projectType).toBe("mobile");
    expect(plan.modules).toContain("المحادثات والرسائل الفورية");
    expect(plan.modules).toContain("مشاركة الملفات والوسائط");
    expect(plan.modules).toContain("الإشعارات والتنبيهات");
    expect(plan.modules).toContain("الأمان وحماية البيانات");
    expect(plan.technicalConsiderations.some((item) => item.includes("نموذج التهديد"))).toBe(true);
    expect(plan.risks.some((item) => item.includes("ترتيبها"))).toBe(true);
  });

  it("does not add unrelated modules to a simple game idea", () => {
    const plan = generateGenesisPlan("Build a small offline puzzle game for Android");
    expect(plan.projectType).toBe("game");
    expect(plan.modules).toContain("حلقة اللعب والتحكم");
    expect(plan.modules).not.toContain("الدفع والاشتراكات");
  });

  it("rejects an empty or very short idea", () => {
    expect(() => generateGenesisPlan("app")).toThrow();
  });

  it("tracks task progress through its lifecycle", () => {
    const plan = generateGenesisPlan("Build a useful mobile application");
    const first = advanceGenesisTask(plan.tasks, plan.tasks[0].id);
    expect(first[0].status).toBe("in_progress");
    const second = advanceGenesisTask(first, plan.tasks[0].id);
    expect(second[0].status).toBe("done");
    expect(getGenesisProgress(second)).toBe(6);
  });
});
