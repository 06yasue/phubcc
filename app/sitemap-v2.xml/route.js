import { turso } from '@/lib/turso';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Narik data dari Turso (Ganti 'slug' jadi nama kolom kedua lo kalau beda)
  // Kalau dua-duanya pakai tabel yang berbeda, query SQL-nya tinggal disesuaikan
  const res = await turso.execute('SELECT id, slug FROM urls ORDER BY id DESC LIMIT 10000');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${res.rows.map(row => {
        // Fallback kalau slug gak ada, gw akalin pakai ID aja biar gak error
        const param2 = row.slug || 'video'; 
        return `
          <url>
            <loc>https://${siteConfig.domain}/tube_${row.id}/${param2}</loc>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
          </url>
        `;
      }).join('')}
    </urlset>
  `;
  
  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}
