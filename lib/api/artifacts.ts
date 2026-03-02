import { apiFetch } from "@/lib/api/apiFetch";

export type Artifact = {
  id: string;
  runId: string;
  runItemId?: string | null;
  type: "screenshot" | "video" | "trace" | "report" | "log" | "other";
  filePath: string;
  downloadUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt?: string;
};

export type ArtifactListResponse = {
  data: Artifact[];
};

export async function listArtifactsForRun(runId: string) {
  return apiFetch<ArtifactListResponse>(`/runs/${runId}/artifacts`);
}
