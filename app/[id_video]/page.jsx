import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import siteConfig from '@/config';
import PlayButton from './PlayButton';

export const dynamic = 'force-dynamic';

// === FUNGSI SERVER ACTION (Dikeluarkan agar Vercel tidak Error 500) ===
export async function grantAccess(id_video, slugTitle) {
  'use server';
  const cookieStore = await cookies();
  cookieStore.set(`access_${id_video}`, 'granted', { maxAge: 900 });
  redirect(`/tube_${id_video}/${slugTitle}`);
}

export default async function FakeVideoPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = 'https://via.placeholder.com/800x450/1e293b/ffffff?text=Video+Player';

  // 1. CARI DATA DENGAN AMAN ANTI-CRASH
  try {
    const resManual = await turso.execute({ sql: "SELECT * FROM video_manual WHERE id_video = ?", args: [id_video] });
    if (resManual && resManual.rows && resManual.rows.length > 0) {
      videoData = resManual.rows[0];
      if (videoData.image_url) thumbUrl = videoData.image_url;
    }
  } catch (e) {}

  if (!videoData) {
    try {
      const resTxt = await turso.execute({ sql: "SELECT * FROM video_txt WHERE id_video = ?", args: [id_video] });
      if (resTxt && resTxt.rows && resTxt.rows.length > 0) {
        videoData = resTxt.rows[0];
        if (videoData.main_thumbnail) thumbUrl = videoData.main_thumbnail;
      }
    } catch (e) {}
  }

  if (!videoData) notFound();

  // 2. PERSIAPAN DATA AMAN (Mencegah teks null bikin meledak)
  const safeTitle = videoData.title ? String(videoData.title) : 'Video Tanpa Judul';
  const safeHitcount = videoData.hitcount || 0;
  const slugTitle = safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';

  // 3. AMBIL 20 VIDEO ACAK DENGAN AMAN
  let randomVideos = [];
  try {
    const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
    if (randManual && randManual.rows) randomVideos = [...randomVideos, ...randManual.rows];
  } catch (e) {}
  
  try {
    const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
    if (randTxt && randTxt.rows) randomVideos = [...randomVideos, ...randTxt.rows];
  } catch (e) {}

  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  // Bind parameter ke fungsi server biar aman
  const bindedGrantAccess = grantAccess.bind(null, id_video, slugTitle);

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

            <form action={bindedGrantAccess} style={{ marginBottom: '20px' }}>
              <PlayButton thumbUrl={thumbUrl} />
            </form>

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
    </div>
  );
}
