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
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px', maxWidth: '900px' }}>
      
      {/* 1. AREA HEADER (Logo & Site Name 3D Centered) */}
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ height: '50px', marginBottom: '10px', objectFit: 'contain' }} 
          onError={(e) => e.target.style.display='none'} 
        />
        <h1 style={{ 
          margin: 0, 
          fontSize: '34px', 
          fontWeight: '900', 
          color: '#1e293b',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          /* Efek Teks 3D Tebel */
          textShadow: '1px 1px 0px #cbd5e1, 2px 2px 0px #94a3b8, 3px 3px 0px #64748b'
        }}>
          {siteConfig.sitename}
        </h1>
      </div>

      {/* 2. SLOT IKLAN (Di atas judul) */}
      <div style={{ marginBottom: '25px', border: '1px dashed #cbd5e1', background: '#f1f5f9', borderRadius: '4px', textAlign: 'center', padding: '15px' }}>
        <p style={{ color: '#64748b', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>Area Slot Iklan (Header)</p>
      </div>

      {/* 3. JUDUL & HITCOUNT (Cegah Judul Kepanjangan) */}
      <h3 style={{ 
        fontWeight: '800', 
        color: '#1e293b', 
        marginBottom: '10px', 
        lineHeight: '1.4',
        /* Kode Pemotong Teks Otomatis */
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
      }} title={videoData.title}>
        {videoData.title}
      </h3>
      
      <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {/* SVG View Icon */}
        <svg style={{ width: '18px', height: '18px', marginRight: '6px', fill: '#3b82f6' }} viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        <span style={{ fontWeight: '600' }}>{videoData.hitcount} Views</span>
      </div>

      {/* 4. FAKE VIDEO PLAYER (Pake SVG Play Button) */}
      <form action={grantAccess}>
        <button type="submit" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', position: 'relative', outline: 'none' }}>
          <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '1px solid #334155' }}>
            <img src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            
            {/* SVG Play Besar di Tengah */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(229, 9, 20, 0.4)' }}>
              <svg viewBox="0 0 24 24" style={{ width: '50px', height: '50px', fill: '#fff' }}>
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            
            {/* Fake Duration/Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: '0%', height: '100%', background: '#e50914' }}></div>
            </div>
          </div>
        </button>
      </form>

      <hr style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

      {/* 5. VIDEO POPULER (Grid Rapi) */}
      <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        {/* SVG Fire Icon */}
        <svg style={{ width: '22px', height: '22px', marginRight: '8px', fill: '#ef4444' }} viewBox="0 0 24 24">
          <path d="M11.71 3.29c-.19-.19-.48-.24-.71-.11-.24.13-.37.38-.33.65.17 1.13.06 2.1-.34 2.89-.4.78-1.02 1.4-1.84 1.84-1.63.89-3.4 2.39-3.4 5.44 0 3.86 3.14 7 7 7s7-3.14 7-7c0-2.82-1.42-4.52-2.73-5.59-1.07-.88-2.22-1.44-3.07-2.33-.84-.87-1.35-1.92-1.58-2.79z"/>
        </svg>
        Video Populer
      </h4>
      
      <div className="row">
        {randomVideos.map((vid, idx) => (
          <div key={idx} className="col-xs-6 col-md-3" style={{ marginBottom: '25px' }}>
            <Link href={`/${vid.id_video}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                {vid.thumb ? (
                  <img src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                )}
                
                {/* SVG Play Icon Kecil (DI TENGAH GAMBAR) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.85)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: '#fff', marginLeft: '2px' }}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Teks Populer (Cegah Kepanjangan) */}
              <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '8px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={vid.title}>
                {vid.title || 'Video Tanpa Judul'}
              </h5>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
