import { getPlatformProxy } from 'wrangler';

// Cloudflare Pages Worker for Next.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // Forward API requests to Next.js server
      const response = await fetch(request);
      return response;
    }
    
    // Handle static assets
    if (url.pathname.startsWith('/_next/') || 
        url.pathname.startsWith('/static/') ||
        url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
      const response = await fetch(request);
      return response;
    }
    
    // Handle all other routes with Next.js
    return fetch(request);
  }
};
