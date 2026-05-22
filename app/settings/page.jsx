"use client";

import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from './actions';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  
  // State untuk nyimpen isi textarea
  const [formData, setFormData] = useState({
    ads_head: '',
    ads_mobile: '',
    ads_desktop: '',
    ads_footer: '',
    ads_native: '',
    link_offer: '',
    link_vpn: ''
  });

  // Pas halaman dimuat, tarik data dari Turso
  useEffect(() => {
    async function loadData() {
      const data = await getSettings();
      if (data) {
        setFormData({
          ads_head: data.ads_head || '',
          ads_mobile: data.ads_mobile || '',
          ads_desktop: data.ads_desktop || '',
          ads_footer: data.ads_footer || '',
          ads_native: data.ads_native || '',
          link_offer: data.link_offer || '',
          link_vpn: data.link_vpn || ''
        });
      }
      setIsFetching(false);
    }
    loadData();
  }, []);

  // Pas form disubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const res = await saveSettings(formData);
    
    setIsLoading(false);
    if (res.success) {
      setMsgType('success');
      setMessage('Pengaturan berhasil disimpan ke database!');
    } else {
      setMsgType('danger');
      setMessage('Gagal menyimpan data: ' + res.error);
    }
    
    // Ilangin notif setelah 4 detik
    setTimeout(() => setMessage(''), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // GAYA DESAIN TEXTAREA & BUTTON
  // ==========================================
  const textareaStyle = {
    background: '#0f172a',
    color: '#f8fafc',
    width: '100%',
    minHeight: '100px',
    borderRadius: '6px',
    border: '1px solid #1e293b',
    padding: '15px',
    fontSize: '14px',
    resize: 'vertical', // Ini yang bikin bisa ditarik ke bawah
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'monospace' // Biar enak pas masukin script
  };

  const labelStyle = {
    fontWeight: '600', 
    color: '#cbd5e1', 
    marginBottom: '8px', 
    display: 'flex', 
    alignItems: 'center'
  };

  const iconStyle = {
    fontSize: '18px', 
    marginRight: '8px', 
    color: '#3b82f6'
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc', paddingTop: '40px', paddingBottom: '80px', fontFamily: '"Noto Sans JP", sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* HEADER */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontWeight: '900', color: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', letterSpacing: '0.5px' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '40px', marginRight: '12px', color: '#3b82f6' }}>settings</span>
            Site Settings
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8' }}>Manajemen link offer dan slot iklan terpusat.</p>
        </div>

        {/* NOTIFIKASI */}
        {message && (
          <div style={{ padding: '15px 20px', borderRadius: '6px', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '500', marginBottom: '25px', background: msgType === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderLeft: msgType === 'danger' ? '4px solid #ef4444' : '4px solid #10b981', color: msgType === 'danger' ? '#fca5a5' : '#a7f3d0' }}>
            <span className="material-icons notranslate" translate="no" style={{ marginRight: '10px', fontSize: '22px', color: msgType === 'danger' ? '#ef4444' : '#10b981' }}>
              {msgType === 'danger' ? 'warning' : 'check_circle'}
            </span>
            {message}
          </div>
        )}

        {isFetching ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '50px 0' }}>
            <span className="material-icons notranslate spin" translate="no" style={{ fontSize: '40px' }}>autorenew</span>
            <p style={{ marginTop: '15px' }}>Memuat pengaturan dari database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.3s' }}>
            
            {/* GROUP 1: LINK OFFERS */}
            <h4 style={{ color: '#f8fafc', fontWeight: '800', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#10b981' }}>link</span>
              Target Link Offer
            </h4>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>attach_money</span> Link Offer Direct</label>
              <textarea name="link_offer" value={formData.link_offer} onChange={handleChange} style={textareaStyle} placeholder="https://link-offer-utama-lo.com..." disabled={isLoading} />
            </div>

            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>security</span> Link Offer VPN</label>
              <textarea name="link_vpn" value={formData.link_vpn} onChange={handleChange} style={textareaStyle} placeholder="https://link-vpn-lo.com..." disabled={isLoading} />
            </div>

            {/* GROUP 2: SLOT IKLAN */}
            <h4 style={{ color: '#f8fafc', fontWeight: '800', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#f59e0b' }}>campaign</span>
              Slot Ads (HTML / Script)
            </h4>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>vertical_align_top</span> Ads Header (Atas)</label>
              <textarea name="ads_head" value={formData.ads_head} onChange={handleChange} style={textareaStyle} placeholder="" disabled={isLoading} />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>smartphone</span> Ads Mobile (HP)</label>
              <textarea name="ads_mobile" value={formData.ads_mobile} onChange={handleChange} style={textareaStyle} placeholder="" disabled={isLoading} />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>desktop_windows</span> Ads Desktop (PC)</label>
              <textarea name="ads_desktop" value={formData.ads_desktop} onChange={handleChange} style={textareaStyle} placeholder="" disabled={isLoading} />
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>vertical_align_bottom</span> Ads Footer (Bawah)</label>
              <textarea name="ads_footer" value={formData.ads_footer} onChange={handleChange} style={textareaStyle} placeholder="" disabled={isLoading} />
            </div>

            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label style={labelStyle}><span className="material-icons notranslate" translate="no" style={iconStyle}>view_day</span> Ads Native Banner</label>
              <textarea name="ads_native" value={formData.ads_native} onChange={handleChange} style={textareaStyle} placeholder="" disabled={isLoading} />
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn-block" style={{ 
              height: '54px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
              cursor: isLoading ? 'wait' : 'pointer'
            }} disabled={isLoading}>
              {isLoading ? <span className="material-icons notranslate spin" translate="no">autorenew</span> : <><span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>save</span> Simpan Pengaturan</>}
            </button>
          </form>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus { outline: none !important; border-color: #3b82f6 !important; }
      `}} />
    </div>
  );
}
