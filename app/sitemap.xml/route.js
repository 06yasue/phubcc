import siteConfig from '@/config';

export async function GET() {
  const sitemaps = ['sitemap-pages.xml', 'sitemap-v1.xml', 'sitemap-v2.xml'];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps.map(sitemap => `
        <sitemap>
          <loc>https://${siteConfig.domain}/${sitemap}</loc>
        </sitemap>
      `).join('')}
    </sitemapindex>
  `;
  
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
