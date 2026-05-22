import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = '';

  // 1. CARI DATA VIDEO INI (100% KODE LO)
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

  // 2. AMBIL 20 VIDEO ACAK UNTUK "POPULER" (100% KODE LO)
  const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
  const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
  
  let randomVideos = [...randManual.rows, ...randTxt.rows];
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  // 3. SERVER ACTION: FUNGSI TOMBOL PLAY (100% KODE LO)
  async function grantAccess() {
    'use server';
    (await cookies()).set(`access_${id_video}`, 'granted', { maxAge: 900 });
    const slugTitle = videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';
    redirect(`/tube_${id_video}/${slugTitle}`);
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* AREA HEADER CUSTOM */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px', marginRight: '10px' }} onError={(e) => e.target.style.display='none'} />
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>{siteConfig.sitename}</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '25px', maxWidth: '1000px' }}>
        <div className="row">
          <div className="col-md-8">
            {/* JUDUL & HITCOUNT */}
            <h2 style={{ fontWeight: '800', color: '#1e293b', marginTop: 0, marginBottom: '10px', fontSize: '24px', lineHeight: '1.4' }}>{videoData.title}</h2>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#3b82f6' }}>visibility</span>
              {videoData.hitcount} Views
            </div>

            {/* FAKE VIDEO PLAYER + ANIMASI LOADING AMAN */}
            <form id="formPlay" action={grantAccess} style={{ marginBottom: '20px' }}>
              <button type="submit" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', position: 'relative' }}>
                <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid #334155' }}>
                  <img id="imgThumb" src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'opacity 0.3s' }} />
                  
                  {/* Ikon Play / Loading */}
                  <div id="boxPlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ef4444' }}>
                    <span id="icoPlay" className="material-icons notranslate" translate="no" style={{ fontSize: '50px', color: '#fff' }}>play_arrow</span>
                    <span id="icoLoad" className="material-icons notranslate spin" translate="no" style={{ fontSize: '50px', color: '#fff', display: 'none' }}>autorenew</span>
                  </div>
                  
                  {/* Fake Progress Bar */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)' }}>
                    <div id="barLoad" style={{ width: '0%', height: '100%', background: '#e50914', transition: 'width 2s ease-in-out' }}></div>
                  </div>
                </div>
              </button>
            </form>

            {/* SLOT ADS */}
            <div style={{ border: '1px solid #cbd5e1', background: '#e2e8f0', borderRadius: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div className="hidden-xs" style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                [ Slot Ads Desktop (Misal 728x90) ]
              </div>
              <div className="visible-xs-block" style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                [ Slot Ads Mobile (Misal 300x250) ]
              </div>
            </div>
          </div>

          {/* AREA VIDEO POPULER */}
          <div className="col-md-4" style={{ marginTop: '20px' }}>
            <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              <span className="material-icons notranslate" translate="no" style={{ color: '#ef4444', marginRight: '8px' }}>trending_up</span>
              Sedang Populer
            </h4>
            
            <div className="row clean-links">
              {randomVideos.map((vid, idx) => (
                <div key={idx} className="col-xs-6 col-md-6" style={{ marginBottom: '15px' }}>
                  <Link href={`/${vid.id_video}`} style={{ display: 'block' }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                      {vid.thumb ? (
                        <img src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      ) : (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                      )}
                      <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', padding: '2px 4px', borderRadius: '2px' }}>
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', color: '#fff', verticalAlign: 'middle' }}>play_arrow</span>
                      </div>
                    </div>
                    {/* Ellipsis Title */}
                    <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '6px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }} title={vid.title}>
                      {vid.title || 'Video'}
                    </h5>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SCRIPT ANIMASI BUTTON (Sangat Aman) */}
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('formPlay').addEventListener('submit', function() {
          document.getElementById('icoPlay').style.display = 'none';
          document.getElementById('icoLoad').style.display = 'block';
          document.getElementById('boxPlay').style.background = 'rgba(0,0,0,0.8)';
          document.getElementById('boxPlay').style.border = '1px solid #475569';
          document.getElementById('imgThumb').style.opacity = '0.4';
          document.getElementById('barLoad').style.width = '20%';
        });
      `}} />

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .clean-links a { text-decoration: none !important; }
        .clean-links a:hover h5 { color: '#3b82f6' !important; }
      `}} />
    </div>
  );
}
