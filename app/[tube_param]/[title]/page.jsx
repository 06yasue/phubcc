import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function RealVideoPage({ params }) {
  // Ambil parameter dari URL (contoh tube_param = "tube_zn50co")
  const { tube_param, title } = await params;
  
  // Ekstrak ID aslinya dengan membuang kata "tube_"
  const id_video = tube_param.replace('tube_', '');

  // ==========================================
  // SISTEM KEAMANAN (CEGAH AKSES LANGSUNG)
  // ==========================================
  const cookieStore = await cookies();
  const accessTicket = cookieStore.get(`access_${id_video}`);
  
  // Jika pengunjung tidak punya tiket (tidak klik tombol play di fake player)
  if (!accessTicket || accessTicket.value !== 'granted') {
    // Tendang balik ke halaman fake player
    redirect(`/${id_video}`);
  }

  // ==========================================
  // AMBIL DATA & TAMBAH HITCOUNT
  // ==========================================
  let videoData = null;
  let sourceTable = '';

  const resManual = await turso.execute({ sql: "SELECT * FROM video_manual WHERE id_video = ?", args: [id_video] });
  if (resManual.rows.length > 0) {
    videoData = resManual.rows[0];
    sourceTable = 'video_manual';
  } else {
    const resTxt = await turso.execute({ sql: "SELECT * FROM video_txt WHERE id_video = ?", args: [id_video] });
    if (resTxt.rows.length > 0) {
      videoData = resTxt.rows[0];
      sourceTable = 'video_txt';
    }
  }

  if (!videoData) notFound();

  // Tambah Hitcount +1 karena sudah masuk halaman nonton asli
  await turso.execute({ sql: `UPDATE ${sourceTable} SET hitcount = hitcount + 1 WHERE id_video = ?`, args: [id_video] });
  
  const finalEmbedUrl = videoData.embed_url || videoData.embed_code;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '20px 0', color: '#fff' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* PLAYER ASLI */}
        <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '20px' }}>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe 
              className="embed-responsive-item" 
              src={finalEmbedUrl} 
              allowFullScreen 
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>

        <h3 style={{ fontWeight: '800', marginTop: 0, marginBottom: '20px', fontSize: '22px' }}>{videoData.title}</h3>

        {/* TOMBOL OFFER / DOWNLOAD (FAKE) */}
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#cbd5e1' }}>
            <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#10b981' }}>download</span>
            Download Full Video (Server Premium)
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ textDecoration: 'none', background: '#3b82f6', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}>
              <span>1080p Full HD (MP4)</span>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
            </a>
            <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ textDecoration: 'none', background: '#6366f1', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>720p HD (MP4)</span>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
            </a>
            <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ textDecoration: 'none', background: '#475569', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>480p SD (MP4)</span>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
