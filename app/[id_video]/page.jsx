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

  let siteSettings = {};
  try {
    const resSettings = await turso.execute("SELECT * FROM site_settings WHERE id = 1");
    if (resSettings.rows.length > 0) {
      siteSettings = resSettings.rows[0];
    }
  } catch (e) {}

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
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* 1. AREA HEADER (Logo & Site Name 3D Centered) */}
        <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: '55px', marginBottom: '12px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} 
          />
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: '900', 
            color: '#1e293b',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textShadow: '1px 1px 0px #cbd5e1, 2px 2px 0px #94a3b8'
          }}>
            {siteConfig.sitename}
          </h1>
        </div>

        {/* 2. AREA IKLAN HEADER (Taruh di atas Judul) */}
        {siteSettings?.ads_head && (
          <div style={{ display: 'table', margin: '0 auto 15px auto', overflow: 'hidden' }} 
               dangerouslySetInnerHTML={{ __html: siteSettings.ads_head }} />
        )}

        {/* 3. JUDUL & HITCOUNT */}
        <h3 style={{ 
          fontWeight: '800', 
          color: '#0f172a', 
          marginBottom: '10px', 
          lineHeight: '1.4',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }} title={videoData.title}>
          {videoData.title}
        </h3>
      
        <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Ikon & Jumlah Views */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{ width: '18px', height: '18px', marginRight: '6px', fill: '#3b82f6' }} viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span style={{ fontWeight: '600' }}>{videoData.hitcount} Views</span>
          </div>

          {/* Ikon & Tanggal Dibuat */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{ width: '18px', height: '18px', marginRight: '6px', fill: '#64748b' }} viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <span style={{ fontWeight: '600' }}>
              {videoData.created_at ? new Date(videoData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
            </span>
          </div>
        </div>

              {/* TRIK CSS PEMBUNUH SPASI IKLAN SILUMAN */}
        <style dangerouslySetInnerHTML={{__html: `
          .iklan-dempet { text-align: center; margin: 0; padding: 0; line-height: 0; font-size: 0; }
          .iklan-dempet div, .iklan-dempet ins { margin: 0 auto !important; padding: 0 !important; }
          .iklan-dempet iframe { display: block !important; margin: 0 auto !important; vertical-align: top !important; }
          .iklan-dempet br { display: none !important; } /* Membunuh tag <br> bawaan dari script iklan */
        `}} />

        {/* AREA ADS DESKTOP & MOBILE (Dijamin Dempet 100% ke Video Player) */}
        {(siteSettings?.ads_desktop || siteSettings?.ads_mobile) && (
          <div className="iklan-dempet" style={{ width: '100%', overflow: 'hidden' }}>
            {siteSettings.ads_desktop && (
              <div className="hidden-xs" dangerouslySetInnerHTML={{ __html: siteSettings.ads_desktop }} />
            )}
            {siteSettings.ads_mobile && (
              <div className="visible-xs-block" dangerouslySetInnerHTML={{ __html: siteSettings.ads_mobile }} />
            )}
          </div>
        )}

        {/* 4. FAKE VIDEO PLAYER */}
          <form id="main-video-form" action={grantAccess} style={{ margin: 0, padding: 0 }}>
          <button type="submit" id="main-video-btn" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: 'pointer', position: 'relative', outline: 'none' }}>
            <div id="player-container" style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid #334155', transition: 'all 0.3s' }}>
              <img id="player-thumb" src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'opacity 0.3s' }} />
              
              <div id="player-play-box" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.95)', borderRadius: '12px', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(229, 9, 20, 0.5)', transition: 'all 0.3s' }}>
                <svg id="icon-play" viewBox="0 0 24 24" style={{ width: '50px', height: '50px', fill: '#fff' }}>
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span id="icon-loading" className="material-icons notranslate spin" translate="no" style={{ fontSize: '50px', color: '#fff', display: 'none' }}>autorenew</span>
              </div>
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', background: 'rgba(255,255,255,0.2)' }}>
                <div id="player-progress" style={{ width: '0%', height: '100%', background: '#e50914', transition: 'width 2s ease-in-out' }}></div>
              </div>
            </div>
          </button>
        </form>

        {/* 5. SLOT NATIVE BANNER ADS (Nempel pas di bawah Player) */}
        {siteSettings?.ads_native && (
          <div style={{ display: 'table', margin: '5px auto 0 auto', overflow: 'hidden' }} 
               dangerouslySetInnerHTML={{ __html: siteSettings.ads_native }} />
        )}

        {/* GARIS PEMISAH ELEGAN */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '40px 0' }}>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #cbd5e1)' }}></div>
          <span className="material-icons notranslate" translate="no" style={{ margin: '0 15px', color: '#94a3b8' }}>videocam</span>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(270deg, transparent, #cbd5e1)' }}></div>
        </div>

        {/* 6. VIDEO POPULER */}
        <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
          <span className="material-icons notranslate" translate="no" style={{ color: '#f59e0b', marginRight: '8px', fontSize: '26px' }}>video_library</span>
          Other Pron {siteConfig.sitename} Sex Videos
        </h4>
        
        <div className="row">
          {randomVideos.map((vid, idx) => (
            <div key={idx} className="col-xs-6 col-md-3" style={{ marginBottom: '25px' }}>
              <Link href={`/${vid.id_video}`} style={{ textDecoration: 'none', display: 'block' }} className="pop-card">
                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  {vid.thumb ? (
                    <img className="pop-img" src={vid.thumb} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No Image</div>
                  )}
                  
                  <div className="pop-play" style={{ position: 'absolute', top: '50%', left: '50%', background: 'rgba(229, 9, 20, 0.9)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)' }}>
                    <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: '#fff', marginLeft: '3px' }}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                
                <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '10px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={vid.title}>
                  {vid.title || 'Video Tanpa Judul'}
                </h5>
              </Link>
            </div>
          ))}
        </div>

        {/* 7. AREA ADS FOOTER (Paling bawah) */}
        {siteSettings?.ads_footer && (
          <div style={{ display: 'table', margin: '15px auto 0 auto', overflow: 'hidden' }} 
               dangerouslySetInnerHTML={{ __html: siteSettings.ads_footer }} />
        )}

      </div>

      {/* SCRIPT & STYLE */}
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('main-video-form').addEventListener('submit', function() {
          document.getElementById('main-video-btn').style.cursor = 'wait';
          document.getElementById('player-thumb').style.opacity = '0.4';
          document.getElementById('player-play-box').style.background = 'rgba(0,0,0,0.8)';
          document.getElementById('player-play-box').style.boxShadow = 'none';
          document.getElementById('icon-play').style.display = 'none';
          document.getElementById('icon-loading').style.display = 'block';
          document.getElementById('player-progress').style.width = '30%';
        });
      `}} />

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .pop-card .pop-play { opacity: 0; transform: translate(-50%, -50%) scale(0.5); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .pop-card .pop-img { transition: transform 0.4s ease; }
        
        .pop-card:hover .pop-play { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        .pop-card:hover .pop-img { transform: scale(1.08); opacity: 0.8; }
        .pop-card:hover h5 { color: '#3b82f6' !important; }
      `}} />
    </div>
  );
}
