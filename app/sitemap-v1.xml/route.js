import { turso } from '@/lib/turso';
import siteConfig from '@/config';

// Wajib biar sitemap selalu update otomatis tiap ada video baru
export const dynamic = 'force-dynamic'; 

export async function GET() {
  // Narik 10.000 data ID video terbaru dari Turso
  const res = await turso.execute('SELECT id FROM urls ORDER BY id DESC LIMIT 10000');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${res.rows.map(row => `
        <url>
          <loc>https://${siteConfig.domain}/${row.id}</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `).join('')}
    </urlset>
  `;
  
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
