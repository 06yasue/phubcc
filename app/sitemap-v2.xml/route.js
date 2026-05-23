import { turso } from '@/lib/turso';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Menggabungkan id_video dan title dari kedua tabel
    const res = await turso.execute(`
      SELECT id_video, title FROM video_txt
      UNION
      SELECT id_video, title FROM video_manual
      LIMIT 5000
    `);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${res.rows.map(row => {
          const cleanTitle = row.title 
            ? row.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') 
                .replace(/\s+/g, '-')         
                .replace(/-+/g, '-')          
            : 'video';                        

          return `
            <url>
              <loc>https://${siteConfig.domain}/tube_${row.id_video}/${cleanTitle}</loc>
              <changefreq>daily</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        }).join('')}
      </urlset>
    `;
    
    return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });

  } catch (error) {
    return new Response('BOS ADA ERROR DI DATABASE: ' + error.message, { status: 500 });
  }
}
