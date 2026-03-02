import { NextRequest } from "next/server";

const MOCK_BASE_URL = process.env.MOCK_API_BASE_URL ?? "http://127.0.0.1:8081";

function buildTargetUrl(pathParts: string[], search: string) {
  const base = MOCK_BASE_URL.replace(/\/$/, "");
  const p = pathParts.join("/");
  return `${base}/${p}${search}`;
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  const targetUrl = buildTargetUrl(path, req.nextUrl.search);

  const headers = new Headers(req.headers);
  // Let fetch set correct host.
  headers.delete("host");

  // Prism mock enforces cookie auth (`testforge_session`). When requests come from the
  // browser, the cookie header may exist (Next.js / other cookies) but not include
  // `testforge_session`, which would cause Prism to return 401.
  const cookie = headers.get("cookie") ?? "";
  if (!cookie.includes("testforge_session=")) {
    const nextCookie = cookie.trim().length > 0 ? `${cookie}; testforge_session=mock` : "testforge_session=mock";
    headers.set("cookie", nextCookie);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    // Avoid Next.js caching for proxy.
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);

  const resHeaders = new Headers(upstream.headers);
  // Ensure browser can read JSON, etc.
  resHeaders.set("access-control-allow-origin", "*");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
