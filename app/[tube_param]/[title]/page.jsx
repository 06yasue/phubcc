import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export default async function RealVideoPage({ params }) {
  // LOGIKA ASLI LO
  const { tube_param, title } = await params;
  const id_video = tube_param.replace('tube_', '');

  const cookieStore = await cookies();
  const accessTicket = cookieStore.get(`access_${id_video}`);
  
  if (!accessTicket || accessTicket.value !== 'granted') {
    redirect(`/${id_video}`);
  }

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

  await turso.execute({ sql: `UPDATE ${sourceTable} SET hitcount = hitcount + 1 WHERE id_video = ?`, args: [id_video] });
  
  const finalEmbedUrl = videoData.embed_url || videoData.embed_code;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* CUSTOM HEADER REAL PAGE (DARK MODE) */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '900px', width: '100%' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '30px', marginRight: '10px' }} onError={(e) => e.target.style.display='none'} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>{siteConfig.sitename}</h1>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* PLAYER ASLI */}
        <div style={{ background: '#000', borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', marginBottom: '20px' }}>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe 
              className="embed-responsive-item" 
              src={finalEmbedUrl} 
              allowFullScreen 
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>

        <h3 style={{ fontWeight: '700', marginTop: 0, marginBottom: '25px', fontSize: '22px', lineHeight: '1.4', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
          {videoData.title}
        </h3>

        <div className="row">
          {/* KOLOM KIRI: TOMBOL OFFER/DOWNLOAD */}
          <div className="col-md-7" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '4px', border: '1px solid #1e293b' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#e2e8f0', fontWeight: '700' }}>
                <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#10b981' }}>cloud_download</span>
                Link Download Tersedia
              </h4>
              
              <div className="clean-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ background: '#2563eb', color: '#fff', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1d4ed8' }}>
                  <span>1080p Full HD (MP4)</span>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
                </a>
                <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ background: '#4f46e5', color: '#fff', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #4338ca' }}>
                  <span>720p HD (MP4)</span>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
                </a>
                <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ background: '#334155', color: '#fff', padding: '12px 15px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e293b' }}>
                  <span>480p SD (MP4)</span>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>file_download</span>
                </a>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: ARTIKEL PANCINGAN VPN */}
          <div className="col-md-5">
            <div style={{ background: '#1e1414', padding: '20px', borderRadius: '4px', border: '1px solid #451a1a' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#fca5a5', fontWeight: '800', display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                <span className="material-icons notranslate" translate="no" style={{ marginRight: '6px', fontSize: '20px' }}>warning</span>
                Video Error / Buffering?
              </h5>
              <p style={{ color: '#f87171', fontSize: '13px', lineHeight: '1.6', marginBottom: '15px' }}>
                Jika video gagal diputar atau terkunci, hal ini biasanya disebabkan oleh pembatasan wilayah dari Internet Service Provider (ISP) Anda. 
                Gunakan jaringan Virtual Private Network untuk mengamankan koneksi dan membuka blokir streaming.
              </p>
              <div className="clean-links">
                <a href="LINK_OFFER_VPN_KAMU" target="_blank" style={{ background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px' }}>
                  <span className="material-icons notranslate" translate="no" style={{ marginRight: '6px', fontSize: '16px' }}>security</span>
                  Aktifkan VPN Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .clean-links a { text-decoration: none !important; }
      `}} />
    </div>
  );
}
