import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['picsum.photos'],
  },
  webpack: (config) => {
    // Configuración para manejar estilos CSS de los módulos de markdown
    config.module.rules.push({
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    });
    
    return config;
  },
};

export default nextConfig;
