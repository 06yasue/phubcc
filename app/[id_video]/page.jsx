import { turso } from '@/lib/turso';
import Link from 'next/link';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  const resolvedParams = await params;
  const id_video = resolvedParams.id_video;

  let videoData = null;
  let thumbUrl = 'https://via.placeholder.com/800x450/1e293b/ffffff?text=Video+Player';

  try {
    const resManual = await turso.execute({ sql: "SELECT * FROM video_manual WHERE id_video = ?", args: [id_video] });
    if (resManual && resManual.rows.length > 0) {
      videoData = resManual.rows[0];
      if (videoData.image_url) thumbUrl = videoData.image_url;
    }
  } catch (e) {}

  if (!videoData) {
    try {
      const resTxt = await turso.execute({ sql: "SELECT * FROM video_txt WHERE id_video = ?", args: [id_video] });
      if (resTxt && resTxt.rows.length > 0) {
        videoData = resTxt.rows[0];
        if (videoData.main_thumbnail) thumbUrl = videoData.main_thumbnail;
      }
    } catch (e) {}
  }

  // Jika ID benar-benar tidak ada di database (Tampilan Error Manual)
  if (!videoData) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="material-icons notranslate" translate="no" style={{ fontSize: '80px', color: '#ef4444', marginBottom: '15px' }}>error_outline</span>
        <h2 style={{ fontWeight: '800', color: '#1e293b', margin: 0 }}>Video Tidak Ditemukan</h2>
        <p style={{ color: '#64748b', marginTop: '10px' }}>ID Video tidak ada di database manual maupun txt.</p>
        <Link href="/" style={{ marginTop: '20px', padding: '10px 25px', background: '#3b82f6', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Kembali</Link>
      </div>
    );
  }

  const safeTitle = videoData.title ? String(videoData.title) : 'Video Tanpa Judul';
  const safeHitcount = videoData.hitcount || 0;
  const slugTitle = safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';

  let randomVideos = [];
  try {
    const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
    if (randManual.rows) randomVideos = [...randomVideos, ...randManual.rows];
    const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
    if (randTxt.rows) randomVideos = [...randomVideos, ...randTxt.rows];
  } catch (e) {}
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
      
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '1000px', width: '100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '32px', marginRight: '10px' }} onError={(e) => e.target.style.display='none'} />
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>{siteConfig.sitename}</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '25px', maxWidth: '1000px' }}>
        <div className="row">
          <div className="col-md-8">
            <h2 style={{ fontWeight: '800', color: '#1e293b', marginTop: 0, marginBottom: '10px', fontSize: '24px', lineHeight: '1.4' }}>{safeTitle}</h2>
            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#3b82f6' }}>visibility</span>
              {safeHitcount} Views
            </div>

            {/* FAKE PLAYER DENGAN ID KHUSUS UNTUK JAVASCRIPT */}
            <div id="btnMainPlay" style={{ width: '100%', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#0f172a', borderRadius: '4px', border: '1px solid #334155', overflow: 'hidden' }}>
                <img id="imgThumb" src={thumbUrl} alt="Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s' }} />
                
                <div id="boxPlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ef4444', transition: 'all 0.2s' }}>
                  <span id="icoPlay" className="material-icons notranslate" translate="no" style={{ fontSize: '50px', color: '#fff' }}>play_arrow</span>
                  <span id="icoLoad" className="material-icons notranslate spin" translate="no" style={{ fontSize: '50px', color: '#fff', display: 'none' }}>autorenew</span>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)' }}>
                  <div id="barLoad" style={{ width: '0%', height: '100%', background: '#e50914', transition: 'width 1s ease-in-out' }}></div>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #cbd5e1', background: '#e2e8f0', borderRadius: '4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div className="hidden-xs" style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                [ Slot Ads Desktop (Misal 728x90) ]
              </div>
              <div className="visible-xs-block" style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>
                [ Slot Ads Mobile (Misal 300x250) ]
              </div>
            </div>
          </div>

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
                    <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '6px', marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }} title={vid.title || 'Video'}>
                      {vid.title ? String(vid.title) : 'Video'}
                    </h5>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .clean-links a { text-decoration: none !important; }
        .clean-links a:hover h5 { color: '#3b82f6' !important; }
      `}} />

      {/* SCRIPT VANILLA JS: ANTI ERROR VERCEL */}
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('btnMainPlay').addEventListener('click', function() {
          // 1. Jalankan Animasi
          this.style.cursor = 'wait';
          document.getElementById('imgThumb').style.opacity = '0.4';
          document.getElementById('boxPlay').style.background = 'rgba(0,0,0,0.8)';
          document.getElementById('boxPlay').style.border = '1px solid #475569';
          document.getElementById('icoPlay').style.display = 'none';
          document.getElementById('icoLoad').style.display = 'block';
          document.getElementById('barLoad').style.width = '20%';
          
          // 2. Beri Tiket Cookie (Berlaku 15 menit)
          document.cookie = "access_${id_video}=granted; max-age=900; path=/";
          
          // 3. Pindah Halaman setelah 1 detik (Biar loadingnya kelihatan nyata)
          setTimeout(function() {
            window.location.href = "/tube_${id_video}/${slugTitle}";
          }, 1000);
        });
      `}} />
    </div>
  );
}
