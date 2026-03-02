import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access to Next.js dev assets when opening the UI via VM public IP.
  // This suppresses the cross-origin dev warning.
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://52.66.199.160:3000",
  ],
};

export default nextConfig;
