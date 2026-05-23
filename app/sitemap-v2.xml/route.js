import { turso } from '@/lib/turso';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Gw hapus pemanggilan kolom 'slug' karena takutnya bikin error
    const res = await turso.execute('SELECT id FROM urls ORDER BY id DESC LIMIT 5000');
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${res.rows.map(row => {
          return `
            <url>
              <loc>https://${siteConfig.domain}/tube_${row.id}/play</loc>
              <changefreq>daily</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        }).join('')}
      </urlset>
    `;
    
    return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error) {
    // KALAU ERROR, MUNCULIN PESANNYA DI LAYAR BIAR KETAHUAN!
    return new Response('BOS ADA ERROR DI DATABASE: ' + error.message, { status: 500 });
  }
}
