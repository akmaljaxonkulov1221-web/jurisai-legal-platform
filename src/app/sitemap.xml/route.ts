import { NextResponse } from 'next/server';
import { generateDynamicSitemap, createSitemapResponse } from '@/lib/seo';
import { config } from '@/lib/env';

export async function GET() {
  try {
    const sitemap = await generateDynamicSitemap(config.app.url);
    return createSitemapResponse(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
