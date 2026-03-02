export function getPublicApiBaseUrl() {
  // When the UI is accessed via VM public IP, the browser cannot reach the VM's
  // local ports using "localhost". So by default we use a same-origin proxy
  // route (`/api/proxy/*`).
  //
  // If you *do* want the browser to call a remote API directly, set
  // NEXT_PUBLIC_API_BASE_URL explicitly.
  const v = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!v) return "";
  return v.replace(/\/$/, "");
}
