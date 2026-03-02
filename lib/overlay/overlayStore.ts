"use client";

// Lightweight client-side overlay store.
// Purpose: make Prism (stateless) feel stateful for frontend UX demos.
// Storage: localStorage

import { type ProjectDetail } from "@/lib/api/projects";
import { type Environment } from "@/lib/api/environments";
import { type Domain } from "@/lib/api/domains";
import { type TestPlan } from "@/lib/api/plans";
import { type TestCase, type TestCaseVersion } from "@/lib/api/cases";
import { type TestRun } from "@/lib/api/runs";

const LS_KEY = "tf_overlay_v1";

export type OverlayDb = {
  projects: ProjectDetail[];
  environments: Environment[];
  domains: Domain[];
  testPlans: TestPlan[];
  testCases: TestCase[];
  testCaseVersions: TestCaseVersion[];
  runs: TestRun[];

  // For plan generation UX
  generatedCasesByPlanId: Record<string, Array<{ title: string; objective?: string; spec?: unknown }>>;

  // For plan generation uploads (demo)
  artifacts: Array<{ id: string; name: string; mimeType: string; sizeBytes: number; dataUrl: string; createdAt: string }>;
};

const EMPTY: OverlayDb = {
  projects: [],
  environments: [],
  domains: [],
  testPlans: [],
  testCases: [],
  testCaseVersions: [],
  runs: [],
  generatedCasesByPlanId: {},
  artifacts: [],
};

function safeParse(raw: string | null): OverlayDb {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<OverlayDb>;
    return {
      ...EMPTY,
      ...data,
      generatedCasesByPlanId: data.generatedCasesByPlanId ?? {},
      artifacts: data.artifacts ?? [],
      projects: data.projects ?? [],
      environments: data.environments ?? [],
      domains: data.domains ?? [],
      testPlans: data.testPlans ?? [],
      testCases: data.testCases ?? [],
      testCaseVersions: data.testCaseVersions ?? [],
      runs: data.runs ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function overlayLoad(): OverlayDb {
  if (typeof window === "undefined") return EMPTY;
  return safeParse(localStorage.getItem(LS_KEY));
}

export function overlaySave(next: OverlayDb) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

export function overlayUpdate(fn: (db: OverlayDb) => OverlayDb) {
  const current = overlayLoad();
  const next = fn(current);
  overlaySave(next);
  return next;
}

export function overlayReset() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}

// ─────────────────────────────────────────────────────────────────────────────
// Merge helpers
// ─────────────────────────────────────────────────────────────────────────────

export function mergeById<T extends { id: string }>(base: T[], overlay: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of base) map.set(item.id, item);
  for (const item of overlay) map.set(item.id, item);
  return Array.from(map.values());
}

export function filterByProjectId<T extends { projectId: string }>(items: T[], projectId: string): T[] {
  return items.filter((x) => x.projectId === projectId);
}

// ─────────────────────────────────────────────────────────────────────────────
// CRUD helpers (overlay)
// ─────────────────────────────────────────────────────────────────────────────

export function overlayUpsertProject(p: ProjectDetail) {
  return overlayUpdate((db) => ({ ...db, projects: mergeById(db.projects, [p]) }));
}

export function overlayUpsertEnvironment(e: Environment) {
  return overlayUpdate((db) => ({ ...db, environments: mergeById(db.environments, [e]) }));
}

export function overlayUpsertDomain(d: Domain) {
  return overlayUpdate((db) => ({ ...db, domains: mergeById(db.domains, [d]) }));
}

export function overlayUpsertPlan(p: TestPlan) {
  return overlayUpdate((db) => ({ ...db, testPlans: mergeById(db.testPlans, [p]) }));
}

export function overlayUpsertCase(c: TestCase) {
  return overlayUpdate((db) => ({ ...db, testCases: mergeById(db.testCases, [c]) }));
}

export function overlayUpsertCaseVersion(v: TestCaseVersion) {
  return overlayUpdate((db) => ({ ...db, testCaseVersions: mergeById(db.testCaseVersions, [v]) }));
}

export function overlayUpsertRun(r: TestRun) {
  return overlayUpdate((db) => ({ ...db, runs: mergeById(db.runs, [r]) }));
}

export function overlaySetGeneratedCases(planId: string, cases: Array<{ title: string; objective?: string; spec?: unknown }>) {
  return overlayUpdate((db) => ({
    ...db,
    generatedCasesByPlanId: {
      ...db.generatedCasesByPlanId,
      [planId]: cases,
    },
  }));
}

export function overlayAddArtifact(a: { id: string; name: string; mimeType: string; sizeBytes: number; dataUrl: string; createdAt: string }) {
  return overlayUpdate((db) => ({ ...db, artifacts: [a, ...db.artifacts] }));
}
