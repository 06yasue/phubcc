'use client';
import { useState } from 'react';
import { authenticate } from './action';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);
    const res = await authenticate(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    // Jurus Nutup Header & Footer: Position Fixed + Z-Index mentok
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#020617', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ICON SVG SECURITY (Elegan) */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '30px' }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>

        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
          System Access
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '50px', letterSpacing: '1px' }}>
          AUTHORIZED PERSONNEL ONLY
        </p>

        {/* FORM TANPA BOX (Garis bawah doang) */}
        <form onSubmit={onSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <input 
            type="email" 
            name="email"
            placeholder="Email Address"
            required
            style={{ width: '100%', padding: '15px 0', background: 'transparent', border: 'none', borderBottom: '2px solid #334155', color: '#f8fafc', fontSize: '16px', marginBottom: '30px', outline: 'none', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderBottom = '2px solid #38bdf8'}
            onBlur={(e) => e.target.style.borderBottom = '2px solid #334155'}
          />

          <input 
            type="password" 
            name="password"
            placeholder="Security Key"
            required
            style={{ width: '100%', padding: '15px 0', background: 'transparent', border: 'none', borderBottom: '2px solid #334155', color: '#f8fafc', fontSize: '16px', marginBottom: '40px', outline: 'none', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderBottom = '2px solid #38bdf8'}
            onBlur={(e) => e.target.style.borderBottom = '2px solid #334155'}
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', background: '#38bdf8', color: '#020617', border: 'none', padding: '16px', fontSize: '16px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', transition: 'opacity 0.3s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Authenticating...' : 'Initialize Access'}
          </button>

          {/* ERROR TEXT (Bukan Alert) */}
          {error && (
            <div style={{ color: '#ef4444', marginTop: '25px', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
