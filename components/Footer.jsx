import Link from 'next/link';
import siteConfig from '@/config';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      padding: '50px 0 20px 0',
      marginTop: 'auto',
      color: '#64748b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div className="container">
        <div className="row">
          
          {/* Kolom Kiri: Info Situs & Domain */}
          <div className="col-md-6">
            <h4 style={{ fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span className="material-icons notranslate" translate="no" style={{ color: '#3b82f6', marginRight: '8px', fontSize: '26px' }}>play_circle</span>
              {siteConfig.sitename}
            </h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
              Platform manajemen video terpusat, cepat, dan aman.<br/>
              Akses resmi via: <a href={`https://${siteConfig.domain}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }} target="_blank" rel="noopener noreferrer">{siteConfig.domain}</a>
            </p>
          </div>

          {/* Kolom Kanan: Menu DMCA & Legal */}
          <div className="col-md-6 text-right" style={{ paddingTop: '15px' }}>
            <ul className="list-inline" style={{ fontSize: '14px', fontWeight: '600' }}>
              <li>
                <Link href="/dmca" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', marginRight: '4px' }}>gavel</span> DMCA
                </Link>
              </li>
              <li style={{ color: '#cbd5e1', margin: '0 10px' }}>|</li>
              <li>
                <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', marginRight: '4px' }}>shield</span> Privacy Policy
                </Link>
              </li>
              <li style={{ color: '#cbd5e1', margin: '0 10px' }}>|</li>
              <li>
                <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', marginRight: '4px' }}>article</span> Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <hr style={{ borderColor: '#e2e8f0', margin: '30px 0 20px 0' }} />
        <div className="text-center" style={{ fontSize: '13px', fontWeight: '500' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>copyright</span>
          {new Date().getFullYear()} {siteConfig.sitename}. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
