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
