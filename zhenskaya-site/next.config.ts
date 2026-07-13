import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
