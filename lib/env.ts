export function getPublicApiBaseUrl() {
  const v = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!v) {
    // Default to the docker-mapped mock server port.
    return "http://localhost:8081";
  }
  return v.replace(/\/$/, "");
}
