import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  // ==========================================
  // 100% LOGIKA NORMAL LO (GAK GW SENTUH SAMA SEKALI)
  // ==========================================
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = '';

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

  const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
  const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
  
  let randomVideos = [...randManual.rows, ...randTxt.rows];
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  async function grantAccess() {
    'use server';
    (await cookies()).set(`access_${id_video}`, 'granted', { maxAge: 900 });
    const slugTitle = videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';
    redirect(`/tube_${id_video}/${slugTitle}`);
  }

  // ==========================================
  // UI & TAMPILAN PROFESIONAL (CSS MURNI, NO JS ANEH-ANEH)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* CUSTOM HEADER FAKE PAGE */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} onError={(e) => e.target.style.display='none'} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>{siteConfig.sitename}</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '25px', maxWidth: '1000px' }}>
        
        {/* JUDUL & HITCOUNT */}
        <h2 style={{ fontWeight: '800', color: '#1e293b', marginTop: 0, marginBottom: '10px', fontSize: '22px', lineHeight: '1.4' }}>
          {videoData.title}
        </h2>
        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#3b82f6' }}>visibility</span>
          {videoData.hitcount} Views
        </div>

        {/* FAKE VIDEO PLAYER DENGAN ANIMASI CSS */}
        <form action={grantAccess} style={{ marginBottom: '25px' }}>
          <button type="submit" className="fake-btn" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', outline: 'none' }}>
            <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', border: '1px solid #334155' }}>
              
              {/* Thumbnail */}
              <img className="thumb-img" src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              
              {/* Ikon Play Center (Kaku & Profesional) */}
              <div className="play-box" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '10px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ef4444' }}>
                <span className="material-icons notranslate play-icon" translate="no" style={{ fontSize: '55px', color: '#fff' }}>play_arrow</span>
              </div>
              
              {/* Fake Progress Bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', background: 'rgba(255,255,255,0.2)' }}>
                <div className="loading-bar" style={{ width: '0%', height: '100%', background: '#e50914' }}></div>
              </div>

            </div>
          </button>
        </form>

        {/* SLOT IKLAN (RESPONSIF) */}
        <div style={{ margin: '30px 0', border: '1px dashed #cbd5e1', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Desktop Ads */}
          <div className="hidden-xs" style={{ width: '100%', height: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginBottom: '4px' }}>monetization_on</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Slot Ads Desktop (728x90)</span>
          </div>
          {/* Mobile Ads */}
          <div className="visible-xs-block" style={{ width: '100%', height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '24px', marginBottom: '8px' }}>monetization_on</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Slot Ads Mobile (300x250)</span>
          </div>
        </div>

        <hr style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

        {/* VIDEO POPULER (GRID: 2 HP, 4 DESKTOP) */}
        <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          <span className="material-icons notranslate" translate="no" style={{ color: '#ef4444', marginRight: '8px' }}>trending_up</span>
          Video Populer Lainnya
        </h4>
        
        <div className="row clean-links">
          {randomVideos.map((vid, idx) => (
            <div key={idx} className="col-xs-6 col-md-3" style={{ marginBottom: '25px' }}>
              <Link href={`/${vid.id_video}`} style={{ display: 'block' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  {vid.thumb ? (
                    <img src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                  )}
                  {/* Overlay Play Icon Kecil */}
                  <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '2px' }}>
                    <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', color: '#fff', verticalAlign: 'middle' }}>play_arrow</span>
                  </div>
                </div>
                {/* Judul Kepotong Rapi */}
                <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '8px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }} title={vid.title}>
                  {vid.title || 'Video Tanpa Judul'}
                </h5>
              </Link>
            </div>
          ))}
        </div>

      </div>

      {/* STYLING CSS MURNI (Animasi Klik & Bersihin Garis Bawah Link) */}
      <style dangerouslySetInnerHTML={{__html: `
        .clean-links a { text-decoration: none !important; }
        .clean-links a:hover h5 { color: '#3b82f6' !important; }
        
        /* Animasi saat tombol dklik (Active State) - 100% Aman dari Vercel Error */
        .fake-btn { cursor: pointer; transition: all 0.2s ease; }
        .fake-btn:active .play-box { transform: translate(-50%, -50%) scale(0.85) !important; background: rgba(0,0,0,0.9) !important; border-color: #475569 !important; }
        .fake-btn:active .thumb-img { opacity: 0.4 !important; transition: opacity 0.1s !important; }
        .fake-btn:active .loading-bar { width: 30% !important; transition: width 0.8s ease-in-out !important; }
        .fake-btn:active .play-icon { opacity: 0.5; }
      `}} />
    </div>
  );
}
