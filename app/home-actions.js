'use server';
import { turso } from '@/lib/turso';

export async function getOfferLink() {
  try {
    // Gw benerin nama kolomnya jadi link_offer sesuai screenshot lu
    const res = await turso.execute('SELECT link_offer FROM site_settings LIMIT 1');
    
    // Tarik datanya dari link_offer
    return res.rows[0]?.link_offer || 'https://google.com'; 
  } catch (error) {
    console.error("Gagal narik link offer:", error.message);
    return 'https://google.com';
  }
}
