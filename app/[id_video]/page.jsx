import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = '';

  // 1. CARI DATA VIDEO INI
  const resManual = await turso.execute({ sql: "SELECT * FROM video_manual WHERE id_video = ?", args: [id_video] });
  if (resManual.rows.length > 0) {
    videoData = resManual.rows[0];
    thumbUrl = videoData.image_url || 'https://via.placeholder.com/800x450/1e293b/ffffff?text=Video+Player';
  } else {
    const resTxt = await turso.execute({ sql: "SELECT * FROM video_txt WHERE id_video = ?", args: [id_video] });
    if (resTxt.rows.length > 0) {
      videoData = resTxt.rows[0];
      thumbUrl = videoData.main_thumbnail;
    }
  }

  if (!videoData) notFound();

  // 2. AMBIL 20 VIDEO ACAK UNTUK "POPULER"
  const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
  const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
  
  let randomVideos = [...randManual.rows, ...randTxt.rows];
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  // 3. SERVER ACTION: FUNGSI TOMBOL PLAY
  async function grantAccess() {
    'use server';
    // Beri tiket rahasia (cookie) berlaku 15 menit
    (await cookies()).set(`access_${id_video}`, 'granted', { maxAge: 900 });
    
    // Bikin URL SEO Friendly dari judul
    const slugTitle = videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';
    
    // Arahkan ke rute /tube_xxx/judul-video
    redirect(`/tube_${id_video}/${slugTitle}`);
  }

  return (
    <div className="container" style={{ marginTop: '20px', marginBottom: '50px', maxWidth: '900px' }}>
      
      {/* JUDUL & HITCOUNT */}
      <h3 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>{videoData.title}</h3>
      <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '5px', color: '#3b82f6' }}>visibility</span>
        {videoData.hitcount} Views
      </div>

      {/* FAKE VIDEO PLAYER */}
      <form action={grantAccess}>
        <button type="submit" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', position: 'relative' }}>
          <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <img src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            {/* Ikon Play Besar di Tengah */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '50%', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(229, 9, 20, 0.5)' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '60px', color: '#fff', marginLeft: '5px' }}>play_arrow</span>
            </div>
            {/* Fake Duration/Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', background: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: '0%', height: '100%', background: '#e50914' }}></div>
            </div>
          </div>
        </button>
      </form>

      {/* SLOT IKLAN (RESPONSIF) */}
      <div style={{ margin: '30px 0', padding: '20px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
        <span className="material-icons notranslate" translate="no" style={{ color: '#94a3b8', fontSize: '24px' }}>monetization_on</span>
        <p style={{ color: '#64748b', margin: '5px 0 0 0', fontWeight: 'bold' }}>Area Slot Iklan (Desktop & Mobile)</p>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Pasang kode script MGID / Adsterra di sini</p>
      </div>

      <hr style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

      {/* VIDEO POPULER (GRID) */}
      <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <span className="material-icons notranslate" translate="no" style={{ color: '#ef4444', marginRight: '8px' }}>local_fire_department</span>
        Video Populer Lainnya
      </h4>
      
      <div className="row">
        {randomVideos.map((vid, idx) => (
          <div key={idx} className="col-xs-6 col-md-3" style={{ marginBottom: '20px' }}>
            <Link href={`/${vid.id_video}`} style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                {vid.thumb ? (
                  <img src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                )}
                {/* Overlay Play Icon Kecil */}
                <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', padding: '2px', borderRadius: '50%' }}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', color: '#fff' }}>play_arrow</span>
                </div>
              </div>
              <h5 style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {vid.title || 'Video Tanpa Judul'}
              </h5>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
