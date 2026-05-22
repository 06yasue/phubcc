'use server';
import { turso } from '@/lib/turso';

// Fungsi nyimpen data dari form manual
export async function saveManualVideo(data) {
  try {
    await turso.execute({
      sql: "INSERT INTO video_manual (id_video, title, embed_url, image_url) VALUES (?, ?, ?, ?)",
      args: [data.id_video, data.title, data.embed_url, data.image_url]
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Fungsi nyimpen data borongan dari TXT
export async function saveTxtVideos(videos) {
  let added = 0;
  
  for (const vid of videos) {
    try {
      await turso.execute({
        sql: "INSERT INTO video_txt (id_video, original_id, title, duration, publish_date, embed_code, main_thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [vid.id_video, vid.original_id, vid.title, vid.duration, vid.publish_date, vid.embed_code, vid.main_thumbnail]
      });
      added++;
    } catch (error) {
      // Abaikan jika error (misal gagal masuk)
    }
  }

  // Hitung total video di database txt sekarang
  const result = await turso.execute("SELECT COUNT(*) as total FROM video_txt");
  const total = result.rows[0].total;

  return { success: true, added, total };
}
