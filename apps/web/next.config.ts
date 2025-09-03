import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support des packages externes
  serverExternalPackages: ["pdf2pic"],
  
  // Configuration pour le monorepo
  transpilePackages: ['@copronomie/shared', '@copronomie/ui', '@copronomie/supabase'],

  // Headers de sécurité renforcés
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Optimisations d'images
  images: {
    domains: ['localhost', 'copronomie.fr'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuration pour la production
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  
  // Build standalone pour Docker
  output: 'standalone',
  
  // Configuration pour le monorepo - éviter les warnings de lockfiles multiples
  outputFileTracingRoot: process.cwd(),
  
  // Configuration du répertoire de build (contournement problème permissions)
  distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next',
  
  // Support expérimental
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverMinification: true,
  },
  
  // Désactiver ESLint temporairement pour build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Variables d'environnement publiques requises
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration webpack pour le monorepo
  webpack: (config, { isServer }) => {
    // Optimisations pour les packages workspace
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;