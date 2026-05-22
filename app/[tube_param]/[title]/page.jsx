import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

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
  // TAMPILAN VIP PLAYER (RAPUH & KONVERSI TINGGI)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', paddingBottom: '60px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

      {/* HEADER DENGAN TOMBOL BACK */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {/* Tombol Back */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '4px' }}>arrow_back_ios</span>
          Back
        </Link>
        
        {/* Judul Header */}
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '1px' }}>
          VIP PLAYER
        </h1>
        
        {/* Spacer Biar Title Tetap Di Tengah */}
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 15px' }}>

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

        {/* JUDUL VIDEO (Diputus rapi kalau panjang) */}
        <h3 style={{ fontWeight: '800', marginTop: 0, marginBottom: '25px', fontSize: '20px', lineHeight: '1.4', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={videoData.title}>
          {videoData.title}
        </h3>

        {/* AREA BAWAH: DIVIDER 2 KOLOM DI PC, 1 KOLOM DI HP */}
        <div className="row">
          
          {/* KOLOM KIRI: DOWNLOAD & BANNER OFFER */}
          <div className="col-md-7" style={{ marginBottom: '25px' }}>
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', display: 'flex', alignItems: 'center', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#3b82f6' }}>cloud_download</span>
                Download Source
              </h4>

              {/* 1. Tombol Download HD Saja */}
              <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '14px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={{ marginRight: '10px', fontSize: '22px' }}>hd</span>
                  <span style={{ fontSize: '15px' }}>Download 1080p HD (MP4)</span>
                </div>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '24px' }}>file_download</span>
              </a>

              {/* 2. Image Banner (Dari folder public) dibungkus Link Offer */}
              <a href="LINK_OFFER_KAMU_DISINI" target="_blank" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #475569', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                {/* Pastikan nama file gambar lo sesuai sama yang ada di folder public */}
                <img src="/dn.jpeg" alt="Download Now" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </a>
            </div>
          </div>

          {/* KOLOM KANAN: VPN OFFER */}
          <div className="col-md-5">
            <div style={{ background: '#1f1616', padding: '25px 20px', borderRadius: '8px', border: '1px solid #451a1a', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              
              {/* Ikon Warning Besar */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '50%' }}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '35px', color: '#ef4444' }}>gpp_bad</span>
                </div>
              </div>

              {/* Artikel Peringatan Bahasa Inggris */}
              <h5 style={{ margin: '0 0 10px 0', color: '#fca5a5', fontWeight: '800', textAlign: 'center', fontSize: '18px' }}>
                Video Not Playing?
              </h5>
              <p style={{ color: '#f87171', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', textAlign: 'center' }}>
                If the video is buffering or blocked, it may be due to ISP restrictions in your country. Please install a secure VPN application to unblock the video and stream smoothly.
              </p>

              {/* Tombol Playstore VPN */}
              <a href="LINK_OFFER_VPN_KAMU" target="_blank" style={{ textDecoration: 'none', background: '#10b981', color: '#fff', padding: '14px 15px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '15px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                {/* SVG Ikon Ala Playstore */}
                <svg style={{ width: '22px', height: '22px', marginRight: '8px', fill: '#fff' }} viewBox="0 0 24 24">
                  <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.38 0 .74.15 1.01.42l11.08 11.08-2.61 2.61L3 4.54V20.5zM15.59 14.01l3.52-3.52-3.52-3.52-2.61 2.61 2.61 2.61zM17.01 15.43l2.67-2.67c.39-.39.39-1.02 0-1.41l-2.67-2.67-1.42 1.42 1.96 1.96-1.96 1.96 1.42 1.42z"/>
                </svg>
                Get VPN on Play Store
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
