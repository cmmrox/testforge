import { getPublicApiBaseUrl } from "@/lib/env";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Override base URL (mainly for tests). */
  baseUrl?: string;
};

async function readResponseBodySafe(res: Response) {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return undefined;
    }
  }
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = (options.baseUrl ?? getPublicApiBaseUrl()).replace(/\/$/, "");
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!res.ok) {
    const data = await readResponseBodySafe(res);
    let message = `Request failed (${res.status})`;
    if (typeof data === "object" && data !== null) {
      const m = (data as Record<string, unknown>).message;
      if (typeof m === "string" && m.trim().length > 0) message = m;
    }

    const err: ApiError = {
      status: res.status,
      message,
      details: data,
    };
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const data = (await readResponseBodySafe(res)) as T;
  return data;
}
