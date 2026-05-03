/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  },
  serverExternalPackages: ['@prisma/client'],
  turbopack: {},
  
  // Netlify optimization - disable static export for API routes
  // output: 'export', // Commented out to allow API routes
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Static generation for better Netlify performance
  generateEtags: false,
  
  webpack: (config) => {
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
