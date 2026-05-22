"use client";
import { useState } from 'react';
import Link from 'next/link';
import siteConfig from '@/config';

export default function Header() {
  // State untuk deteksi menu di HP (Buka/Tutup)
  const [isOpen, setIsOpen] = useState(false);

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
        
        {/* Bagian Kiri (Logo) & Tombol HP */}
        <div className="navbar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', color: '#1e293b', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px', height: 'auto', padding: '15px' }}>
            <span className="material-icons notranslate" translate="no" style={{ color: '#3b82f6', marginRight: '10px', fontSize: '32px' }}>video_library</span>
            {siteConfig.sitename}
          </Link>
          
          {/* Tombol Hamburger Khusus HP (Tanpa jQuery) */}
          <button 
            type="button" 
            className="navbar-toggle" 
            onClick={() => setIsOpen(!isOpen)}
            style={{ display: 'block', border: 'none', background: isOpen ? '#f1f5f9' : 'transparent', marginRight: '15px' }}
          >
            <span className="material-icons notranslate" translate="no" style={{ color: '#3b82f6', fontSize: '28px', verticalAlign: 'middle' }}>
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Bagian Kanan (Menu List) */}
        {/* Logika biar bisa buka tutup otomatis di HP */}
        <div className={`navbar-collapse ${isOpen ? 'collapse in' : 'collapse'}`} style={{ display: isOpen ? 'block' : '', borderTop: isOpen ? '1px solid #f1f5f9' : 'none' }}>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link href="/list" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '8px', color: '#8b5cf6' }}>view_list</span> 
                List Video
              </Link>
            </li>
            <li>
              <Link href="/upload" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '8px', color: '#10b981' }}>cloud_upload</span> 
                Upload Data
              </Link>
            </li>
            <li>
              <Link href="/settings" style={menuStyle}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '20px', marginRight: '8px', color: '#64748b' }}>settings</span> 
                Settings
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Tambahan CSS responsif untuk sembunyikan tombol di PC */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .navbar-toggle { display: none !important; }
          .navbar-header { width: auto !important; }
        }
      `}} />
    </nav>
  );
}
