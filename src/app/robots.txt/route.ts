import { NextResponse } from 'next/server';
import { generateRobotsTxt, createRobotsTxtResponse } from '@/lib/seo';
import { config } from '@/lib/env';

export async function GET() {
  try {
    const sitemapUrl = `${config.app.url}/sitemap.xml`;
    const robotsTxt = generateRobotsTxt(config.app.url, sitemapUrl);
    return createRobotsTxtResponse(robotsTxt);
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    return new NextResponse('Error generating robots.txt', { status: 500 });
  }
}
