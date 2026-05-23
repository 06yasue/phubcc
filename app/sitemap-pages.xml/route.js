import siteConfig from '@/config';

export async function GET() {
  // Daftar halaman statis lo
  const pages = ['', 'dmca', 'privacy', 'terms'];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>https://${siteConfig.domain}/${page}</loc>
          <changefreq>weekly</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>
      `).join('')}
    </urlset>
  `;
  
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
