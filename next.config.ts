import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    contents: {
      stale: 1800,
      revalidate: 600,
      expire: 86400,
    },
    contentsSlug: {
      stale: 1800,
      revalidate: 600,
      expire: 86400,
    },
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        "node:fs/promises": false,
        "node:path": false,
      };
    }

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
      fs: { browser: "./empty.js" },
      "node:fs/promises": { browser: "./empty.js" },
      path: { browser: "./empty.js" },
      "node:path": { browser: "./empty.js" },
    },
  },
};

export default nextConfig;
