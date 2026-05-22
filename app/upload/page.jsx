"use client";
import { useState } from 'react';
import { saveManualVideo, saveTxtVideos } from './actions';

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('manual');
  
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  const [manualResultUrl, setManualResultUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [txtStats, setTxtStats] = useState(null);

  // ==========================================
  // SUBMIT MANUAL (TERHUBUNG KE TURSO)
  // ==========================================
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const fakeId = Math.random().toString(36).substring(2, 8);
    const title = e.target.title.value;
    const embedUrl = e.target.embedUrl.value;
    const imageUrl = e.target.imageUrl.value; 

    const res = await saveManualVideo({ id_video: fakeId, title, embed_url: embedUrl, image_url: imageUrl });
    
    setIsLoading(false);
    if (res.success) {
      setManualResultUrl(`${window.location.origin}/${fakeId}`);
      setMsgType('success');
      setMessage('Video berhasil disimpan ke database!');
      e.target.reset();
    } else {
      setMsgType('danger');
      setMessage('Gagal menyimpan ke database.');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(manualResultUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // ==========================================
  // SUBMIT TXT 
  // ==========================================
  const handleTxtSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.txtFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      
      let validVideos = [];
      let seenOriginalIds = new Set();
      let isError = false;
      let errorLine = 0;
      let duplicatesFound = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split('|');
        if (cols.length !== 6) {
          isError = true; errorLine = i + 1; break;
        }

        const original_id = cols[0].trim();
        
        if (seenOriginalIds.has(original_id)) {
          duplicatesFound++;
          continue;
        }
        seenOriginalIds.add(original_id);

        let embedCode = cols[4].trim();
        const srcMatch = embedCode.match(/src="([^"]+)"/);
        if (srcMatch) embedCode = srcMatch[1]; 

        let rawImageUrl = cols[5].trim();
        let finalImageUrl = rawImageUrl.replace(/^https?:\/\//, ''); 
        finalImageUrl = `https://i0.wp.com/${finalImageUrl}`;

        validVideos.push({
          id_video: Math.random().toString(36).substring(2, 8), 
          original_id: original_id,
          title: cols[1].trim(),
          duration: cols[2].trim(),
          publish_date: cols[3].trim(),
          embed_code: embedCode,
          main_thumbnail: finalImageUrl
        });
      }

      if (isError) {
        setMsgType('danger');
        setMessage(`GAGAL: Format salah di baris ke-${errorLine}. Harus ada 6 kolom dipisah tanda |`);
        setTxtStats(null);
        return;
      }

      setIsLoading(true);
      setMsgType('info');
      setMessage('Sedang menyuntikkan data ke database...');

      const res = await saveTxtVideos(validVideos);
      setIsLoading(false);

      if (res.success) {
        setMsgType('success');
        setMessage('Proses Import Selesai!');
        setTxtStats({ added: res.added, duplicates: duplicatesFound, total: res.total });
      } else {
        setMsgType('danger');
        setMessage('Terjadi kesalahan saat menyimpan ke database Turso.');
      }
      setTimeout(() => setMessage(''), 5000);
    };

    reader.readAsText(file);
  };

  // ==========================================
  // GAYA DESAIN PREMIUM DARK MODE (TANPA BOX)
  // ==========================================
  const inputStyle = {
    background: '#0f172a',
    color: '#f8fafc',
    height: '50px',
    borderRadius: '6px',
    border: '1px solid #1e293b',
    boxShadow: 'none',
    fontSize: '15px',
    paddingLeft: '15px',
    transition: 'border-color 0.2s'
  };

  const iconAddon = {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRight: 'none',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
    color: '#64748b'
  };

  const btnStyle = {
    height: '54px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: isLoading ? 'wait' : 'pointer'
  };

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc', paddingTop: '40px', paddingBottom: '80px', fontFamily: '"Noto Sans JP", sans-serif' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* HEADER */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontWeight: '900', color: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', letterSpacing: '0.5px' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '40px', marginRight: '12px', color: '#3b82f6' }}>cloud_sync</span>
            Upload Center
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8' }}>Manajemen aman, cepat, dan terpusat ke database Turso.</p>
        </div>

        {/* TAB BUTTONS (Tampilan Modern Tanpa Box) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '35px', borderBottom: '1px solid #1e293b' }}>
          <button 
            onClick={() => setActiveTab('manual')}
            style={{ 
              flex: 1, padding: '12px 0', border: 'none', background: 'transparent', 
              color: activeTab === 'manual' ? '#3b82f6' : '#64748b', 
              fontWeight: activeTab === 'manual' ? 'bold' : 'normal', 
              borderBottom: activeTab === 'manual' ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.2s', outline: 'none'
            }}>
            <span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>draw</span> 
            Upload Manual
          </button>
          <button 
            onClick={() => setActiveTab('txt')}
            style={{ 
              flex: 1, padding: '12px 0', border: 'none', background: 'transparent', 
              color: activeTab === 'txt' ? '#10b981' : '#64748b', 
              fontWeight: activeTab === 'txt' ? 'bold' : 'normal', 
              borderBottom: activeTab === 'txt' ? '3px solid #10b981' : '3px solid transparent',
              transition: 'all 0.2s', outline: 'none'
            }}>
            <span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>library_books</span> 
            Import Data TXT
          </button>
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

        {/* ======================= TAB MANUAL ======================= */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} style={{ animation: 'fadeIn 0.3s' }}>
            
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>Judul Video</label>
              <div className="input-group">
                <span className="input-group-addon" style={iconAddon}><span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>subtitles</span></span>
                <input type="text" name="title" className="form-control" style={{...inputStyle, borderLeft: 'none'}} required placeholder="Contoh: Video Kucing Lucu" disabled={isLoading} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '30px' }}>
              <label style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>URL Embed (Direct Link / Iframe)</label>
              <div className="input-group">
                <span className="input-group-addon" style={iconAddon}><span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>link</span></span>
                <input type="url" name="embedUrl" className="form-control" style={{...inputStyle, borderLeft: 'none'}} required placeholder="https://..." disabled={isLoading} />
              </div>
            </div>

            <div style={{ marginBottom: '35px' }}>
              <label style={{ fontWeight: '600', color: '#cbd5e1', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', fontSize: '20px', color: '#8b5cf6' }}>wallpaper</span> 
                Data Thumbnail (Opsional)
              </label>
              <div className="row">
                <div className="col-md-6" style={{ marginBottom: '15px' }}>
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Pilih File Langsung:</p>
                  <input type="file" accept="image/*" className="form-control" style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#94a3b8', height: 'auto', padding: '10px', borderRadius: '6px' }} disabled={isLoading} />
                </div>
                <div className="col-md-6">
                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Atau Masukkan URL Gambar:</p>
                  <input type="url" name="imageUrl" className="form-control" placeholder="https://..." style={inputStyle} disabled={isLoading} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-block" style={{ ...btnStyle, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)' }} disabled={isLoading}>
              {isLoading ? <span className="material-icons notranslate spin" translate="no">autorenew</span> : <><span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>cloud_done</span> Simpan ke Turso</>}
            </button>

            {/* Hasil Upload Manual */}
            {manualResultUrl && (
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                <p style={{ color: '#a7f3d0', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={{ marginRight: '6px', fontSize: '20px', color: '#10b981' }}>campaign</span> Link Akses Penonton:
                </p>
                <div className="input-group">
                  <input type="text" className="form-control" readOnly value={manualResultUrl} style={{ background: '#0f172a', color: '#10b981', border: '1px solid #1e293b', height: '45px', borderRadius: '6px 0 0 6px', fontWeight: '600' }} />
                  <span className="input-group-btn">
                    <button type="button" onClick={handleCopy} style={{ height: '45px', borderRadius: '0 6px 6px 0', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', padding: '0 20px', cursor: 'pointer' }}>
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                  </span>
                </div>
              </div>
            )}
          </form>
        )}

        {/* ======================= TAB TXT ======================= */}
        {activeTab === 'txt' && (
          <form onSubmit={handleTxtSubmit} style={{ animation: 'fadeIn 0.3s' }}>
            
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: '600', color: '#cbd5e1', fontSize: '15px', marginBottom: '10px' }}>Pilih File Database (.txt)</label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons notranslate" translate="no" style={{ position: 'absolute', top: '13px', left: '15px', color: '#64748b', fontSize: '24px' }}>description</span>
                <input type="file" name="txtFile" accept=".txt" className="form-control" required style={{ height: 'auto', padding: '14px 15px 14px 50px', borderRadius: '6px', border: '1px dashed #334155', background: '#0f172a', color: '#f8fafc', fontSize: '15px', cursor: 'pointer' }} disabled={isLoading} />
              </div>
            </div>

            <div style={{ padding: '15px', borderRadius: '6px', borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', marginBottom: '35px' }}>
              <p style={{ color: '#fbbf24', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                <strong style={{ display: 'block', marginBottom: '6px' }}>Format Wajib (Pemisah Pipa |):</strong>
                <code style={{ background: '#1e293b', color: '#fcd34d', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                  ID | Title | Duration | Publish date | Embed code | Main thumbnail
                </code>
              </p>
            </div>

            <button type="submit" className="btn-block" style={{ ...btnStyle, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }} disabled={isLoading}>
              {isLoading ? <span className="material-icons notranslate spin" translate="no">autorenew</span> : <><span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>rocket_launch</span> Eksekusi Data Massal</>}
            </button>

            {/* Statistik Hasil Upload TXT */}
            {txtStats && (
              <div style={{ marginTop: '35px' }}>
                <h4 style={{ color: '#f8fafc', fontWeight: '800', display: 'flex', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                  <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', color: '#0ea5e9' }}>pie_chart</span> 
                  Laporan Database Turso
                </h4>
                <div className="row text-center">
                  <div className="col-xs-4">
                    <h3 style={{ margin: 0, color: '#10b981', fontWeight: '900', fontSize: '28px' }}>{txtStats.added}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '5px 0 0 0' }}>Sukses Masuk</p>
                  </div>
                  <div className="col-xs-4" style={{ borderLeft: '1px solid #1e293b', borderRight: '1px solid #1e293b' }}>
                    <h3 style={{ margin: 0, color: '#ef4444', fontWeight: '900', fontSize: '28px' }}>{txtStats.duplicates}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '5px 0 0 0' }}>ID Ditolak</p>
                  </div>
                  <div className="col-xs-4">
                    <h3 style={{ margin: 0, color: '#3b82f6', fontWeight: '900', fontSize: '28px' }}>{txtStats.total}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '5px 0 0 0' }}>Total di DB</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
      
      {/* CSS Animasi Tambahan */}
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        /* Hilangkan box biru pas input di klik */
        input:focus { outline: none !important; border-color: #3b82f6 !important; }
      `}} />
    </div>
  );
}
