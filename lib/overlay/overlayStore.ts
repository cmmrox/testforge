"use client";

// Lightweight client-side overlay store.
// Purpose: make Prism (stateless) feel stateful for frontend UX demos.
// Storage: localStorage

import { type ProjectDetail } from "@/lib/api/projects";
import { type Environment } from "@/lib/api/environments";
import { type Domain } from "@/lib/api/domains";
import { type TestPlan } from "@/lib/api/plans";
import { type TestCase, type TestCaseVersion } from "@/lib/api/cases";

const LS_KEY = "tf_overlay_v1";

export type OverlayDb = {
  projects: ProjectDetail[];
  environments: Environment[];
  domains: Domain[];
  testPlans: TestPlan[];
  testCases: TestCase[];
  testCaseVersions: TestCaseVersion[];
  // For plan generation UX
  generatedCasesByPlanId: Record<string, Array<{ title: string; objective?: string; spec?: unknown }>>;
};

const EMPTY: OverlayDb = {
  projects: [],
  environments: [],
  domains: [],
  testPlans: [],
  testCases: [],
  testCaseVersions: [],
  generatedCasesByPlanId: {},
};

function safeParse(raw: string | null): OverlayDb {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<OverlayDb>;
    return {
      ...EMPTY,
      ...data,
      generatedCasesByPlanId: data.generatedCasesByPlanId ?? {},
      projects: data.projects ?? [],
      environments: data.environments ?? [],
      domains: data.domains ?? [],
      testPlans: data.testPlans ?? [],
      testCases: data.testCases ?? [],
      testCaseVersions: data.testCaseVersions ?? [],
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
