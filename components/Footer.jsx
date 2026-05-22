"use client"; // Tambahkan ini di baris paling atas
import Link from 'next/link';
import siteConfig from '@/config';
import { usePathname } from 'next/navigation'; // Import alat pendeteksi URL

export default function Footer() {
  const pathname = usePathname();

  // LOGIKA PINTAR: Kalau URL depannya /tube_, jangan render Footer sama sekali
  if (pathname && pathname.startsWith('/tube_')) {
    return null; 
  }

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      padding: '50px 0 20px 0',
      marginTop: 'auto',
      color: '#94a3b8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div className="container">
        <div className="row text-center-xs">
          
          <div className="col-sm-6" style={{ marginBottom: '30px' }}>
            <h4 style={{ fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', marginBottom: '15px' }} className="footer-brand">
              <span className="material-icons notranslate" translate="no" style={{ color: '#3b82f6', marginRight: '10px', fontSize: '28px' }}>video_library</span>
              {siteConfig.sitename}
            </h4>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#cbd5e1', maxWidth: '400px' }} className="footer-desc">
              Platform manajemen video terpusat, cepat, dan aman untuk mengelola database konten digitalmu.
            </p>
            <div style={{ marginTop: '15px' }}>
              <span style={{ fontSize: '13px', background: '#1e293b', padding: '6px 12px', borderRadius: '20px', color: '#3b82f6', border: '1px solid #334155' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>language</span>
                {siteConfig.domain}
              </span>
            </div>
          </div>

          <div className="col-sm-6 text-right footer-links-area" style={{ marginTop: '10px' }}>
            <div style={{ display: 'inline-flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="footer-flex-center">
              <Link href="/dmca" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#64748b' }}>gavel</span> DMCA
              </Link>
              <Link href="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#64748b' }}>shield</span> Privacy
              </Link>
              <Link href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '500' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '6px', color: '#64748b' }}>article</span> Terms
              </Link>
            </div>
          </div>
          
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #334155, transparent)', margin: '30px 0 20px 0' }}></div>
        
        <div className="text-center" style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>copyright</span>
          {new Date().getFullYear()} {siteConfig.sitename}. All rights reserved.
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .text-center-xs { text-align: center !important; }
          .footer-brand { justify-content: center !important; }
          .footer-desc { margin: 0 auto !important; }
          .footer-links-area { text-align: center !important; margin-top: 30px !important; }
          .footer-flex-center { justify-content: center !important; gap: 15px !important; }
        }
      `}} />
    </footer>
  );
}
