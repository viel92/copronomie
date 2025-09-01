import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf2pic", "canvas"],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Configuration serveur pour pdfjs-dist
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        worker_threads: false
      };
    } else {
      // Configuration client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Optimisation pour PDF.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf': 'pdfjs-dist/build/pdf.min.js',
      'pdfjs-dist/build/pdf.worker': 'pdfjs-dist/build/pdf.worker.min.js'
    };

    return config;
  },

  // Headers de sécurité
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Optimisations d'images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuration pour Vercel
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
};

export default nextConfig;
