/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  },
  serverExternalPackages: ['@prisma/client'],
  turbopack: {},
  
  // Netlify optimization - enable server-side rendering
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Static generation for better Netlify performance
  generateEtags: false,
  
  // Skip static generation for dynamic routes
  skipTrailingSlashRedirect: true,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
}

module.exports = nextConfig
