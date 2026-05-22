import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = '';

  // 1. CARI DATA VIDEO INI (100% KODE ASLI LO)
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

  // 2. AMBIL 20 VIDEO ACAK UNTUK "POPULER" (100% KODE ASLI LO)
  const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
  const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
  
  let randomVideos = [...randManual.rows, ...randTxt.rows];
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  // 3. SERVER ACTION: FUNGSI TOMBOL PLAY (100% KODE ASLI LO)
  async function grantAccess() {
    'use server';
    (await cookies()).set(`access_${id_video}`, 'granted', { maxAge: 900 });
    const slugTitle = videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';
    redirect(`/tube_${id_video}/${slugTitle}`);
  }

  // 4. TAMPILAN UI (DIRAPIHKAN TANPA MERUBAH FUNGSI)
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* HEADER SIMPEL */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} onError={(e) => e.target.style.display='none'} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Platform Video</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '25px', maxWidth: '1000px' }}>
        <div className="row">
          
          <div className="col-md-8">
            <h2 style={{ fontWeight: '800', color: '#1e293b', marginTop: 0, marginBottom: '10px', fontSize: '22px', lineHeight: '1.4' }}>{videoData.title}</h2>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '5px', color: '#3b82f6' }}>visibility</span>
              <span style={{ fontWeight: '600' }}>{videoData.hitcount} Views</span>
            </div>

            {/* FAKE VIDEO PLAYER (Struktur Asli Lo) */}
            <form action={grantAccess} style={{ marginBottom: '20px' }}>
              <button type="submit" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }}>
                {/* Border Kaku (4px) */}
                <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
                  <img src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '10px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-icons notranslate" translate="no" style={{ fontSize: '50px', color: '#fff' }}>play_arrow</span>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', background: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ width: '0%', height: '100%', background: '#e50914' }}></div>
                  </div>
                </div>
              </button>
            </form>

            {/* SLOT IKLAN */}
            <div style={{ border: '1px dashed #cbd5e1', background: '#f1f5f9', borderRadius: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '30px' }}>
              <div className="hidden-xs" style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                Slot Ads Desktop
              </div>
              <div className="visible-xs-block" style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                Slot Ads Mobile
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Sedang Populer</h4>
            <div className="row">
              {randomVideos.map((vid, idx) => (
                <div key={idx} className="col-xs-6 col-md-6" style={{ marginBottom: '20px' }}>
                  <Link href={`/${vid.id_video}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                      {vid.thumb ? (
                        <img src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                      )}
                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '2px' }}>
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', color: '#fff' }}>play_arrow</span>
                      </div>
                    </div>
                    {/* Teks kepotong rapi */}
                    <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '8px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {vid.title || 'Video'}
                    </h5>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
