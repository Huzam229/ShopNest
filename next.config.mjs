import { defineConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["13.62.106.72"],

  // 🚀 REQUIRED for EC2 production deployment
  output: "standalone",
};

export default nextConfig;