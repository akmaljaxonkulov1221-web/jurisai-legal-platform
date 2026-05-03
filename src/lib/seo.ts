import { NextResponse } from 'next/server';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface SitemapOptions {
  baseUrl: string;
  excludePaths?: string[];
  additionalPages?: SitemapEntry[];
}

export function generateSitemap(options: SitemapOptions): string {
  const { baseUrl, excludePaths = [], additionalPages = [] } = options;
  
  // Static pages with their SEO properties
  const staticPages: SitemapEntry[] = [
    {
      url: '/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: '/dashboard',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: '/irac',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: '/legal-chat',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: '/document-generator',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: '/legal-database-new',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: '/billing',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: '/signin',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: '/signup',
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Filter out excluded paths and combine with additional pages
  const allPages = [
    ...staticPages.filter(page => !excludePaths.includes(page.url)),
    ...additionalPages,
  ];

  // Generate XML sitemap
  const sitemapEntries = allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string, sitemapUrl: string): string {
  return `# JURISAI Legal AI Platform
# Uzbekistan Legal Technology Platform

User-agent: *
Allow: /

# Allow search engines to crawl important pages
Allow: /dashboard
Allow: /irac
Allow: /legal-chat
Allow: /document-generator
Allow: /legal-database-new

# Disallow admin and private pages
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /auth/

# Disallow sensitive user data
Disallow: /settings
Disallow: /profile

# Sitemap location
Sitemap: ${sitemapUrl}

# Crawl delay (be respectful)
Crawl-delay: 1

# Special instructions for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 1`;
}

export function createSitemapResponse(sitemap: string): NextResponse {
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export function createRobotsTxtResponse(robotsTxt: string): NextResponse {
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

// Dynamic sitemap generation for dynamic content
export async function generateDynamicSitemap(baseUrl: string): Promise<string> {
  // This would typically fetch from your database
  // For now, we'll return the static sitemap
  
  const options: SitemapOptions = {
    baseUrl,
    excludePaths: ['/admin', '/api'],
  };

  return generateSitemap(options);
}

// Helper function to get all dynamic routes for sitemap
export async function getDynamicRoutes(): Promise<SitemapEntry[]> {
  // Example: Fetch from database
  // const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });
  // return posts.map(post => ({
  //   url: `/blog/${post.slug}`,
  //   lastModified: post.updatedAt.toISOString(),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  // For now, return empty array
  return [];
}

// SEO utilities
export const seoUtils = {
  // Generate structured data for SEO
  generateOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'JURISAI',
      url: 'https://jurisai.uz',
      logo: 'https://jurisai.uz/logo.png',
      description: 'O\'zbekistonning yetakchi yuridik AI platformasi',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'UZ',
        addressLocality: 'Tashkent',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+998901234567',
        contactType: 'customer service',
        availableLanguage: ['Uzbek', 'Russian', 'English'],
      },
    };
  },

  generateWebsiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'JURISAI',
      url: 'https://jurisai.uz',
      description: 'O\'zbekiston yuridik AI platformasi - IRAC tahlili, hujjat generatsiyasi, AI maslahatchi',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jurisai.uz/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
  },

  generateServiceSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Yuridik AI Maslahatchi',
      description: 'AI yordamida yuridik maslahatlar va hujjatlar generatsiyasi',
      provider: {
        '@type': 'Organization',
        name: 'JURISAI',
      },
      serviceType: 'Legal Services',
      areaServed: {
        '@type': 'Country',
        name: 'Uzbekistan',
      },
    };
  },
};
