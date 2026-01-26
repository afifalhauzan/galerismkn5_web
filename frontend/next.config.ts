import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Use wildcards for your domains to handle staging AND production in one build
      {
        protocol: 'https',
        hostname: '**.duckdns.org', // Matches galeri-staging.duckdns.org AND galerismkn5.duckdns.org
      },
      {
        protocol: 'https',
        hostname: 'karya.smkn5malang.sch.id',
      },
      // Keep localhost for your local testing
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
  },
  // REMOVED: env block. 
  // We handle this via next-runtime-env in the layout/components instead.
};

export default nextConfig;