import { turso } from '@/lib/turso';
import { notFound } from 'next/navigation';

// Wajib ditambahin biar Next.js gak nge-cache halaman ini,
// jadi hitcount-nya bisa nambah terus tiap kali di-refresh.
export const dynamic = 'force-dynamic';

export default async function VideoPlayerPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let sourceTable = '';

  // ==========================================
  // 1. CARI DATA DI DATABASE TURSO
  // ==========================================
  
  // Cek ke tabel manual dulu
  const resultManual = await turso.execute({
    sql: "SELECT * FROM video_manual WHERE id_video = ?",
    args: [id_video]
  });

  if (resultManual.rows.length > 0) {
    videoData = resultManual.rows[0];
    sourceTable = 'video_manual';
  } else {
    // Kalau gak ketemu di manual, cari ke tabel TXT
    const resultTxt = await turso.execute({
      sql: "SELECT * FROM video_txt WHERE id_video = ?",
      args: [id_video]
    });

    if (resultTxt.rows.length > 0) {
      videoData = resultTxt.rows[0];
      sourceTable = 'video_txt';
    }
  }

  // ==========================================
  // 2. JIKA VIDEO GAK ADA -> LEMPAR KE 404
  // ==========================================
  if (!videoData) {
    notFound(); // Otomatis manggil file not-found.jsx yang udah kita buat
  }

  // ==========================================
  // 3. JIKA ADA -> TAMBAH HITCOUNT + 1
  // ==========================================
  await turso.execute({
    sql: `UPDATE ${sourceTable} SET hitcount = hitcount + 1 WHERE id_video = ?`,
    args: [id_video]
  });

  // Siapkan variabel untuk ditampilkan
  // (Karena nama kolom beda: 'embed_url' di manual, 'embed_code' di TXT)
  const videoTitle = videoData.title;
  const finalEmbedUrl = videoData.embed_url || videoData.embed_code;
  const currentHitcount = Number(videoData.hitcount) + 1; // Ditambah 1 karena yang di db belum ke-refresh di variabel ini

  // ==========================================
  // 4. RENDER TAMPILAN
  // ==========================================
  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '50px' }}>
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          
          <h3 className="page-header" style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '28px', marginRight: '10px', color: '#e50914' }}>movie</span>
            {videoTitle}
          </h3>
          
          {/* Iframe Beneran dari Database */}
          <div className="embed-responsive embed-responsive-16by9" style={{ backgroundColor: '#000', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            <iframe 
              className="embed-responsive-item" 
              src={finalEmbedUrl} 
              allowFullScreen 
              style={{ border: 'none' }}
            ></iframe>
          </div>

          <div style={{ marginTop: '20px', padding: '15px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
            <p className="text-muted" style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', fontSize: '22px', color: '#337ab7' }}>visibility</span> 
              Hitcount: <strong style={{ color: '#333', marginLeft: '5px', marginRight: '5px' }}>{currentHitcount}</strong> Penonton
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
