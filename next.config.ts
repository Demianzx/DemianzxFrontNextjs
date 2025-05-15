import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['demianzxgamesstorage.blob.core.windows.net','picsum.photos'],
  },  
  output: 'standalone',
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
  env: {
    PORT: process.env.PORT || '3000'
  }
};

export default nextConfig;
