import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["dd-trace"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/dd-trace/**/*", "./node_modules/@datadog/**/*"],
  },
};

export default nextConfig;
