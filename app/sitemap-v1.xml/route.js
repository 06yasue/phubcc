import { turso } from '@/lib/turso';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    // Menggabungkan id_video dari video_txt dan video_manual
    const res = await turso.execute(`
      SELECT id_video FROM video_txt
      UNION
      SELECT id_video FROM video_manual
      LIMIT 5000
    `);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${res.rows.map(row => `
          <url>
            <loc>https://${siteConfig.domain}/${row.id_video}</loc>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
          </url>
        `).join('')}
      </urlset>
    `;
    
    return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error) {
    return new Response('BOS ADA ERROR DI DATABASE: ' + error.message, { status: 500 });
  }
}
