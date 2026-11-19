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
