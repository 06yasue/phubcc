'use server';
import { turso } from '@/lib/turso';

// Fungsi untuk mengambil data video dengan Pagination
export async function getVideos(type, page = 1, limit = 12) {
  const table = type === 'manual' ? 'video_manual' : 'video_txt';
  const offset = (page - 1) * limit;

  try {
    // Ambil total data untuk hitung total halaman
    const countResult = await turso.execute(`SELECT COUNT(*) as total FROM ${table}`);
    const totalItems = countResult.rows[0].total; // ini ditarik buat ditampilin
    const totalPages = Math.ceil(totalItems / limit) || 1;

    // Ambil data sesuai halaman
    const result = await turso.execute({
      sql: `SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset]
    });

    // Format data agar mudah dibaca di frontend
    const videos = result.rows.map(row => ({
      id_video: row.id_video,
      title: row.title,
      embed_url: type === 'manual' ? row.embed_url : row.embed_code,
      image_url: type === 'manual' ? row.image_url : row.main_thumbnail,
      hitcount: row.hitcount,
      created_at: row.created_at
    }));

    // Ditambah total: totalItems di sini bos
    return { success: true, videos, totalPages, currentPage: page, total: totalItems };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Fungsi untuk menghapus 1 video
export async function deleteVideo(type, id_video) {
  const table = type === 'manual' ? 'video_manual' : 'video_txt';
  try {
    await turso.execute({
      sql: `DELETE FROM ${table} WHERE id_video = ?`,
      args: [id_video]
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// FUNGSI BARU: Untuk sapu bersih semua data khusus di tabel video_txt
export async function deleteAllTxtVideos() {
  try {
    await turso.execute(`DELETE FROM video_txt`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
