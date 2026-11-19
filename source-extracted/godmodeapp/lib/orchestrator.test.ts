import { describe, expect, it } from "vitest";
import { createOrchestrationRun, finishOrchestratedTask, getRunnableTasks, requestTaskApproval, resolveTaskApproval, startOrchestratedTask } from "./orchestrator";
import { generateGenesisPlan } from "./genesis";

describe("GODMODE Orchestrator", () => {
  const plan = () => generateGenesisPlan("Build a mobile application with user accounts and publish a release", new Date("2026-11-19T12:00:00Z"));

  it("creates a dependency graph and only exposes the first phase", () => {
    const run = createOrchestrationRun(plan());
    expect(run.tasks).toHaveLength(18);
    expect(getRunnableTasks(run).every((task) => task.phase === 1)).toBe(true);
    expect(run.tasks.filter((task) => task.status === "blocked").length).toBe(15);
  });

  it("unlocks the next phase only after all dependencies are complete", () => {
    let run = createOrchestrationRun(plan());
    for (const task of getRunnableTasks(run)) {
      run = startOrchestratedTask(run, task.id);
      run = finishOrchestratedTask(run, task.id, "تم التحقق من المخرج.");
    }
    expect(getRunnableTasks(run).every((task) => task.phase === 2)).toBe(true);
  });

  it("prevents approval-gated actions from starting without approval", () => {
    const p = plan();
    const releaseTask = p.tasks.find((task) => /release|نشر/i.test(task.title + task.deliverable));
    expect(releaseTask).toBeDefined();
    let run = createOrchestrationRun(p);
    const target = run.tasks.find((task) => task.id === releaseTask!.id)!;
    expect(target.requiresApproval).toBe(true);
    expect(() => startOrchestratedTask(run, target.id)).toThrow(/موافقة/);
  });

  it("requires explicit approval before an approval-gated task can run", () => {
    const p = plan();
    const releaseTask = p.tasks.find((task) => /release|نشر/i.test(task.title + task.deliverable))!;
    let run = createOrchestrationRun(p);
    const target = run.tasks.find((task) => task.id === releaseTask.id)!;
    run = { ...run, tasks: run.tasks.map((task) => task.id === target.id ? { ...task, status: "ready" as const, dependsOn: [] } : task) };
    run = requestTaskApproval(run, target.id);
    expect(run.tasks.find((task) => task.id === target.id)?.status).toBe("awaiting_approval");
    run = resolveTaskApproval(run, target.id, true);
    expect(run.tasks.find((task) => task.id === target.id)?.status).toBe("running");
  });
});
