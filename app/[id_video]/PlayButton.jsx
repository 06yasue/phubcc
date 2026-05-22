"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayButton({ thumbUrl, id_video, slugTitle }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePlay = () => {
    setLoading(true);
    // Bikin tiket rahasia murni pakai browser JS (berlaku 15 menit)
    document.cookie = `access_${id_video}=granted; max-age=900; path=/`;
    // Langsung arahkan ke halaman video asli
    router.push(`/tube_${id_video}/${slugTitle}`);
  };

  return (
    <button onClick={handlePlay} type="button" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: loading ? 'wait' : 'pointer', position: 'relative' }} disabled={loading}>
      <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#0f172a', borderRadius: '4px', border: '1px solid #334155', overflow: 'hidden' }}>
        <img src={thumbUrl} alt="Video Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loading ? 0.4 : 0.7, transition: 'opacity 0.3s' }} />
        
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: loading ? 'rgba(0,0,0,0.8)' : 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: loading ? '1px solid #475569' : '1px solid #ef4444', transition: 'all 0.2s' }}>
          <span className={`material-icons notranslate ${loading ? 'spin' : ''}`} translate="no" style={{ fontSize: '50px', color: '#fff' }}>
            {loading ? 'autorenew' : 'play_arrow'}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)' }}>
          <div style={{ width: loading ? '15%' : '0%', height: '100%', background: '#e50914', transition: 'width 2s ease-in-out' }}></div>
        </div>
      </div>
    </button>
  );
}
