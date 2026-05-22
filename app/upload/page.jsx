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
    const imageUrl = e.target.imageUrl.value; // Nanti untuk file fisik butuh storage tambahan

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
  // SUBMIT TXT (LOGIKA POTONG IFRAME & i0.wp.com)
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
        
        // Cek duplikat ID bawaan di dalam file itu sendiri
        if (seenOriginalIds.has(original_id)) {
          duplicatesFound++;
          continue;
        }
        seenOriginalIds.add(original_id);

        // LOGIKA 1: Ekstrak URL dari Iframe
        let embedCode = cols[4].trim();
        const srcMatch = embedCode.match(/src="([^"]+)"/);
        if (srcMatch) embedCode = srcMatch[1]; // Ambil URL di dalam src saja

        // LOGIKA 2: Modifikasi URL Gambar (Tambah i0.wp.com)
        let rawImageUrl = cols[5].trim();
        let finalImageUrl = rawImageUrl.replace(/^https?:\/\//, ''); // Buang http/https
        finalImageUrl = `https://i0.wp.com/${finalImageUrl}`;

        validVideos.push({
          id_video: Math.random().toString(36).substring(2, 8), // URL dinamis
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

      // Kirim array data yang sudah bersih ke Server Action
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
  // GAYA DESAIN PREMIUM (CSS JS)
  // ==========================================
  const cardStyle = {
    background: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    borderRadius: '12px',
    border: 'none',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    height: '50px',
    borderRadius: '8px',
    border: '2px solid #eef2f5',
    boxShadow: 'none',
    fontSize: '15px',
    paddingLeft: '15px'
  };

  const iconAddon = {
    background: '#f8fafc',
    border: '2px solid #eef2f5',
    borderRight: 'none',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    color: '#64748b'
  };

  const btnStyle = {
    height: '54px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px', maxWidth: '800px' }}>
      
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontWeight: '800', color: '#1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '40px', marginRight: '12px', color: '#3b82f6' }}>cloud_sync</span>
          Data Upload Center
        </h2>
        <p className="text-muted" style={{ fontSize: '16px' }}>Manajemen aman, cepat, dan terpusat ke database Turso.</p>
      </div>

      <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '12px', display: 'flex', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('manual')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: activeTab === 'manual' ? '#fff' : 'transparent', color: activeTab === 'manual' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'manual' ? 'bold' : 'normal', boxShadow: activeTab === 'manual' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
          <span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>draw</span> Upload Manual
        </button>
        <button 
          onClick={() => setActiveTab('txt')}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: activeTab === 'txt' ? '#fff' : 'transparent', color: activeTab === 'txt' ? '#10b981' : '#64748b', fontWeight: activeTab === 'txt' ? 'bold' : 'normal', boxShadow: activeTab === 'txt' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
          <span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>library_books</span> Import TXT
        </button>
      </div>

      {message && (
        <div className={`alert alert-${msgType}`} style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '500', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span className="material-icons notranslate" translate="no" style={{ marginRight: '10px', fontSize: '24px' }}>
            {msgType === 'danger' ? 'warning' : 'check_circle'}
          </span>
          {message}
        </div>
      )}

      {/* ======================= TAB MANUAL ======================= */}
      {activeTab === 'manual' && (
        <div className="panel" style={cardStyle}>
          <div className="panel-body" style={{ padding: '35px' }}>
            <form onSubmit={handleManualSubmit}>
              
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Judul Video</label>
                <div className="input-group">
                  <span className="input-group-addon" style={iconAddon}><span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>subtitles</span></span>
                  <input type="text" name="title" className="form-control" style={{...inputStyle, borderLeft: 'none'}} required placeholder="Contoh: Video Kucing Lucu" disabled={isLoading} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '8px' }}>URL Embed (Direct Link / Iframe)</label>
                <div className="input-group">
                  <span className="input-group-addon" style={iconAddon}><span className="material-icons notranslate" translate="no" style={{ fontSize: '20px' }}>link</span></span>
                  <input type="url" name="embedUrl" className="form-control" style={{...inputStyle, borderLeft: 'none'}} required placeholder="https://..." disabled={isLoading} />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px dashed #cbd5e1', marginBottom: '30px' }}>
                <label style={{ fontWeight: '600', color: '#475569', marginBottom: '15px', display: 'block' }}>
                  <span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', marginRight: '6px', fontSize: '20px', color: '#8b5cf6' }}>wallpaper</span> 
                  Thumbnail Video (Opsional)
                </label>
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Pilih File Langsung:</p>
                    <input type="file" accept="image/*" className="form-control" style={{ height: 'auto', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} disabled={isLoading} />
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Atau Masukkan URL Gambar:</p>
                    <input type="url" name="imageUrl" className="form-control" placeholder="https://..." style={{ height: '42px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'none' }} disabled={isLoading} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ ...btnStyle, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none' }} disabled={isLoading}>
                {isLoading ? <span className="material-icons notranslate spin" translate="no">autorenew</span> : <><span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>cloud_done</span> Simpan Data ke Turso</>}
              </button>
            </form>

            {manualResultUrl && (
              <div style={{ marginTop: '30px', padding: '20px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <p style={{ color: '#065f46', fontWeight: 'bold', marginBottom: '10px' }}><span className="material-icons notranslate" translate="no" style={{ verticalAlign: 'middle', fontSize: '18px' }}>campaign</span> Selesai! Link akses penonton:</p>
                <div className="input-group">
                  <input type="text" className="form-control" readOnly value={manualResultUrl} style={{ height: '45px', borderRadius: '6px 0 0 6px', background: '#fff', border: '1px solid #6ee7b7', color: '#047857', fontWeight: '600' }} />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="button" onClick={handleCopy} style={{ height: '45px', borderRadius: '0 6px 6px 0', background: '#10b981', border: 'none', fontWeight: 'bold' }}>
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB TXT ======================= */}
      {activeTab === 'txt' && (
        <div className="panel" style={cardStyle}>
          <div className="panel-body" style={{ padding: '35px' }}>
            <form onSubmit={handleTxtSubmit}>
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', color: '#475569', fontSize: '16px', marginBottom: '10px' }}>Pilih File Database (.txt)</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-icons notranslate" translate="no" style={{ position: 'absolute', top: '15px', left: '15px', color: '#94a3b8', fontSize: '24px' }}>description</span>
                  <input type="file" name="txtFile" accept=".txt" className="form-control" required style={{ height: 'auto', padding: '15px 15px 15px 50px', borderRadius: '8px', border: '2px dashed #cbd5e1', background: '#f8fafc', fontSize: '15px', cursor: 'pointer' }} disabled={isLoading} />
                </div>
              </div>

              <div style={{ background: '#fffbeb', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '30px' }}>
                <p style={{ color: '#b45309', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                  <strong>Format Wajib (Pemisah Pipa |):</strong><br/>
                  <code style={{ background: '#fef3c7', color: '#92400e', border: 'none', padding: '2px 6px', borderRadius: '4px' }}>ID | Title | Duration | Publish date | Embed code | Main thumbnail</code>
                </p>
              </div>

              <button type="submit" className="btn btn-success btn-block" style={{ ...btnStyle, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }} disabled={isLoading}>
                {isLoading ? <span className="material-icons notranslate spin" translate="no">autorenew</span> : <><span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>rocket_launch</span> Eksekusi Data Massal</>}
              </button>
            </form>

            {txtStats && (
              <div style={{ marginTop: '30px', padding: '20px', background: '#f0fdfa', borderRadius: '10px', border: '1px solid #5eead4' }}>
                <h4 style={{ color: '#0f766e', fontWeight: 'bold', display: 'flex', alignItems: 'center', marginTop: 0, marginBottom: '15px' }}>
                  <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>pie_chart</span> Laporan Database Turso
                </h4>
                <div className="row text-center">
                  <div className="col-xs-4">
                    <h3 style={{ margin: 0, color: '#059669', fontWeight: '900' }}>{txtStats.added}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Sukses Masuk</p>
                  </div>
                  <div className="col-xs-4" style={{ borderLeft: '1px solid #ccfbf1', borderRight: '1px solid #ccfbf1' }}>
                    <h3 style={{ margin: 0, color: '#e11d48', fontWeight: '900' }}>{txtStats.duplicates}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>ID Ditolak</p>
                  </div>
                  <div className="col-xs-4">
                    <h3 style={{ margin: 0, color: '#0284c7', fontWeight: '900' }}>{txtStats.total}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total di DB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* CSS untuk muter icon loading */}
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
