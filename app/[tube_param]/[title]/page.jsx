import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import siteConfig from '@/config';

export const dynamic = 'force-dynamic';

export default async function RealVideoPage({ params }) {
  // ==========================================
  // LOGIKA ASLI (TIDAK DIRUBAH SAMA SEKALI)
  // ==========================================
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

  // ==========================================
  // UI VIP PLAYER (FLOATING HEADER & TANPA BOX)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc', paddingBottom: '60px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* HEADER FLOATING (Melayang saat di-scroll) */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 999, 
        background: '#0f172a', 
        borderBottom: '1px solid #1e293b', 
        padding: '15px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' 
      }}>
        {/* Tombol Back ke Fake Player */}
        <Link href={`/${id_video}`} style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '4px' }}>arrow_back_ios</span>
          Back
        </Link>
        
        {/* Judul Header (Dari config) */}
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {siteConfig.sitename}
        </h1>
        
        {/* Spacer Biar Title Tetap Di Tengah */}
        <div style={{ width: '60px' }}></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 15px' }}>

        {/* PLAYER ASLI */}
        <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '20px', border: '1px solid #334155' }}>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe 
              className="embed-responsive-item" 
              src={finalEmbedUrl} 
              allowFullScreen 
              style={{ border: 'none', width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>

        {/* JUDUL VIDEO */}
        <h3 style={{ fontWeight: '800', marginTop: 0, marginBottom: '25px', fontSize: '20px', lineHeight: '1.4', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={videoData.title}>
          {videoData.title}
        </h3>

        {/* GARIS PEMISAH VIDEO & AREA DOWNLOAD */}
        <hr style={{ borderColor: '#1e293b', margin: '0 0 30px 0' }} />

        {/* AREA BAWAH: TANPA BOX, CUMA PEMISAH */}
        <div className="row">
          
          {/* KOLOM KIRI: DOWNLOAD & BANNER OFFER */}
          <div className="col-md-7" style={{ marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', display: 'flex', alignItems: 'center', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#3b82f6' }}>cloud_download</span>
              Direct Source
            </h4>

            {/* Tombol Download HD Saja */}
            <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '14px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="material-icons notranslate" translate="no" style={{ marginRight: '10px', fontSize: '22px' }}>hd</span>
                <span style={{ fontSize: '15px' }}>Download 1080p HD (MP4)</span>
              </div>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '24px' }}>file_download</span>
            </a>

            {/* Image Banner dn.jpeg dibungkus Link Offer */}
            <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1e293b', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
              <img src="/dn.jpeg" alt="Download Action" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </a>
          </div>

          {/* KOLOM KANAN: VPN OFFER */}
          <div className="col-md-5">
            {/* Garis Pemisah (Makin rapi kalau di HP) */}
            <hr className="visible-xs-block" style={{ borderColor: '#1e293b', margin: '0 0 30px 0' }} />

            <div style={{ padding: '0 10px' }}>
              {/* Ikon Warning Besar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '45px', color: '#ef4444' }}>gpp_bad</span>
              </div>

              {/* Artikel Peringatan Bahasa Inggris */}
              <h5 style={{ margin: '0 0 10px 0', color: '#fca5a5', fontWeight: '800', textAlign: 'center', fontSize: '18px' }}>
                Content Restricted
              </h5>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '25px', textAlign: 'center' }}>
                This media content is currently blocked by your ISP or unavailable in your geographical region. To bypass these restrictions and ensure a secure, uninterrupted streaming experience, a Virtual Private Network is required.
              </p>

              {/* Tombol Playstore VPN (SVG Playstore Realistis) */}
              <a href="LINK_OFFER_VPN_KAMU" target="_blank" style={{ textDecoration: 'none', background: '#10b981', color: '#fff', padding: '14px 15px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '15px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                {/* SVG Ikon Google Play Asli */}
                <svg style={{ width: '20px', height: '20px', marginRight: '8px', fill: '#fff' }} viewBox="0 0 24 24">
                  <path d="M18.9 11.2l-13-7.5C5.3 3.4 4.5 3.8 4.5 4.5v15c0 .7.8 1.1 1.4.8l13-7.5c.6-.4.6-1.2 0-1.6z"/>
                </svg>
                Get it on Google Play
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
