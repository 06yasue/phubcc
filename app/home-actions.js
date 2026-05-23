'use server';
import { turso } from '@/lib/turso';

export async function getOfferLink() {
  try {
    // Sesuaikan nama tabel dan kolom dengan database lo
    // Disini gw asumsikan lo nyimpen linknya di tabel site_settings
    const res = await turso.execute('SELECT offer_link FROM site_settings LIMIT 1');
    
    // Kalau link ada di database, pake itu. Kalau kosong, pake link default.
    return res.rows[0]?.offer_link || 'https://google.com'; 
  } catch (error) {
    console.error("Gagal narik link offer:", error.message);
    return 'https://google.com'; // Link cadangan kalau database error
  }
}
