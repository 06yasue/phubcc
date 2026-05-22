'use server'

import { turso } from '@/lib/turso';

// Fungsi narik data setting saat halaman dimuat
export async function getSettings() {
  try {
    const res = await turso.execute("SELECT * FROM site_settings WHERE id = 1");
    if (res.rows.length > 0) return res.rows[0];
    return null;
  } catch (error) {
    return null;
  }
}

// Fungsi nyimpen data setting pas tombol ditekan
export async function saveSettings(data) {
  try {
    await turso.execute({
      sql: `UPDATE site_settings SET 
        ads_head = ?, ads_mobile = ?, ads_desktop = ?, ads_footer = ?, ads_native = ?, link_offer = ?, link_vpn = ? 
        WHERE id = 1`,
      args: [
        data.ads_head || '', 
        data.ads_mobile || '', 
        data.ads_desktop || '', 
        data.ads_footer || '', 
        data.ads_native || '', 
        data.link_offer || '', 
        data.link_vpn || ''
      ]
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
