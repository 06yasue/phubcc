"use client";
import { useFormStatus } from 'react-dom';

export default function PlayButton({ thumbUrl }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" style={{ width: '100%', border: 'none', padding: 0, background: 'transparent', cursor: pending ? 'wait' : 'pointer', position: 'relative' }} disabled={pending}>
      <div style={{ width: '100%', paddingTop: '56.25%', position: 'relative', backgroundColor: '#0f172a', borderRadius: '4px', border: '1px solid #334155', overflow: 'hidden' }}>
        <img src={thumbUrl} alt="Video Thumbnail" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: pending ? 0.4 : 0.7, transition: 'opacity 0.3s' }} />
        
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: pending ? 'rgba(0,0,0,0.8)' : 'rgba(229, 9, 20, 0.9)', borderRadius: '4px', padding: '12px 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: pending ? '1px solid #475569' : '1px solid #ef4444', transition: 'all 0.2s' }}>
          <span className={`material-icons notranslate ${pending ? 'spin' : ''}`} translate="no" style={{ fontSize: '50px', color: '#fff' }}>
            {pending ? 'autorenew' : 'play_arrow'}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)' }}>
          <div style={{ width: pending ? '15%' : '0%', height: '100%', background: '#e50914', transition: 'width 2s ease-in-out' }}></div>
        </div>
      </div>
    </button>
  );
}
