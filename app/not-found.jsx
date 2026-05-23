import Link from 'next/link';
import siteConfig from '@/config';

// 1. DYNAMIC SEO METADATA
export const metadata = {
  title: `404 - Page Not Found | ${siteConfig.sitename}`,
  description: "Oops! The page you're looking for has floated away into the void. Return to mission control to find your way back.",
};

export default function NotFound() {
  return (
    <main style={{ 
      backgroundColor: '#020617', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f8fafc',
      textAlign: 'center',
      padding: '20px'
    }}>
      
      {/* BACKGROUND TWINKLING STARS */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
          .star { position: absolute; background: white; border-radius: 50%; animation: blink infinite ease-in-out; }
          @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
          .astronaut-svg { animation: float 6s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.4)); }
        `}} />
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 3 + 2) + 's',
              animationDelay: Math.random() * 5 + 's'
            }} 
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ANIMATED ASTRONAUT SVG */}
        <div className="astronaut-svg" style={{ marginBottom: '40px' }}>
          <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M150 100C150 127.614 127.614 150 100 150C72.3858 150 50 127.614 50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100Z" fill="#334155" />
            <path d="M140 100C140 122.091 122.091 140 100 140C77.9086 140 60 122.091 60 100C60 77.9086 77.9086 60 100 60C122.091 60 140 77.9086 140 100Z" fill="#1e293b" />
            <rect x="75" y="85" width="50" height="30" rx="15" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2"/>
            <circle cx="100" cy="40" r="10" fill="#38bdf8" />
            <path d="M100 150V180M70 170L100 180L130 170" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>

        {/* ERROR TEXT */}
        <h1 style={{ 
          fontSize: '120px', 
          fontWeight: '900', 
          margin: 0, 
          lineHeight: '1', 
          color: '#38bdf8', 
          letterSpacing: '-5px',
          textShadow: '0 0 30px rgba(56, 189, 248, 0.5)'
        }}>404</h1>
        
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginTop: '10px', color: '#f1f5f9' }}>
          LOST IN SPACE?
        </h2>
        
        <p style={{ 
          maxWidth: '500px', 
          margin: '20px auto 40px', 
          color: '#94a3b8', 
          fontSize: '18px', 
          lineHeight: '1.6' 
        }}>
          The page you are looking for has drifted into deep space. 
          It might have been moved, deleted, or never existed in this galaxy.
        </p>

        {/* GLOWING RETURN BUTTON */}
        <Link href="/" style={{
          display: 'inline-block',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '16px 40px',
          borderRadius: '50px',
          fontSize: '18px',
          fontWeight: '700',
          textDecoration: 'none',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
          transition: 'all 0.3s ease'
        }}>
          Return to Mission Control
        </Link>
      </div>

      {/* FOOTER SITE NAME */}
      <div style={{ position: 'absolute', bottom: '30px', color: '#475569', fontSize: '14px', fontWeight: '600', letterSpacing: '2px' }}>
        &copy; 2026 {siteConfig.sitename.toUpperCase()} . SYSTEM ERROR
      </div>
    </main>
  );
}
