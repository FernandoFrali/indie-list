import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    contents: {
      stale: 1800,
      revalidate: 600,
      expire: 86400,
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    resolveAlias: {
      canvas: { browser: "./empty.js" },
      fs: { browser: "./empty.js" },
      path: { browser: "./empty.js" },
    },
  },
};

export default nextConfig;
