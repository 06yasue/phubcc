import Link from 'next/link';
import siteConfig from '@/config';

export default function Header() {
  // Gaya CSS khusus untuk menu agar lebih interaktif
  const menuStyle = {
    display: 'flex', 
    alignItems: 'center', 
    fontWeight: '600', 
    color: '#475569',
    padding: '15px 20px'
  };

  return (
    <nav className="navbar navbar-default" style={{
      backgroundColor: '#ffffff',
      border: 'none',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
      borderRadius: 0,
      marginBottom: 0,
      padding: '5px 0'
    }}>
      <div className="container">
        {/* Bagian Logo Kiri */}
        <div className="navbar-header">
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', color: '#1e293b', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#3b82f6', marginRight: '10px', fontSize: '32px' }}>play_circle</span>
            {siteConfig.sitename}
          </Link>
        </div>

        {/* Bagian Menu Kanan */}
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link href="/list" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '6px', color: '#8b5cf6' }}>view_list</span> 
                List Video
              </Link>
            </li>
            <li>
              <Link href="/upload" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '6px', color: '#10b981' }}>cloud_upload</span> 
                Upload Data
              </Link>
            </li>
            <li>
              <Link href="/settings" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '6px', color: '#64748b' }}>settings</span> 
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
