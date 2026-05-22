"use client";
import { useState } from 'react';

export default function UploadPage() {
  // State untuk Tab Pilihan
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' atau 'txt'

  // State untuk Notifikasi Global
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  // State Khusus Upload Manual
  const [manualResultUrl, setManualResultUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // State Khusus Upload TXT
  const [txtStats, setTxtStats] = useState(null);

  // ------------------------------------------
  // LOGIKA UPLOAD MANUAL
  // ------------------------------------------
  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    // Simulasi hasil generate ID acak (Nanti diganti API Turso asli)
    const fakeId = Math.random().toString(36).substring(2, 8);
    const finalUrl = `${window.location.origin}/${fakeId}`;
    
    setManualResultUrl(finalUrl);
    setMsgType('success');
    setMessage('Video manual berhasil disiapkan!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(manualResultUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // ------------------------------------------
  // LOGIKA UPLOAD TXT (Dengan Validasi Kolom)
  // ------------------------------------------
  const handleTxtSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n');
        
        let isError = false;
        let errorLine = 0;

        // Validasi: Cek apakah tiap baris punya persis 6 kolom
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const columns = line.split('|');
            if (columns.length !== 6) {
              isError = true;
              errorLine = i + 1;
              break;
            }
          }
        }

        if (isError) {
          // Jika format berantakan, TOLAK dan tampilkan error
          setMsgType('danger');
          setMessage(`GAGAL: Format salah terdeteksi pada baris ke-${errorLine}. Pastikan setiap baris memiliki 6 bagian yang dipisah karakter |`);
          setTxtStats(null);
        } else {
          // Jika aman, lanjut (Simulasi sukses API)
          setMsgType('success');
          setMessage('File data.txt valid! Sedang memproses ke database...');
          
          setTxtStats({
            duplicates: 2, // Simulasi data ganda
            added: lines.filter(line => line.trim() !== '').length - 2,
            total: 150 // Simulasi total data di database
          });
          
          setTimeout(() => setMessage(''), 5000);
        }
      };

      reader.readAsText(file);
    }
  };

  // Gaya CSS inline untuk mempercantik tampilan Bootstrap 3
  const cardStyle = {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderRadius: '8px',
    border: 'none',
    overflow: 'hidden'
  };

  const iconStyle = {
    verticalAlign: 'middle',
    marginRight: '6px',
    fontSize: '20px'
  };

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>

      <div className="page-header" style={{ marginTop: 0, borderBottom: '2px solid #eee' }}>
        <h2 style={{ display: 'flex', alignItems: 'center' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '32px', marginRight: '10px', color: '#337ab7' }}>cloud_upload</span>
          Manajemen Upload <small style={{ marginLeft: '10px' }}>Database Video</small>
        </h2>
      </div>

      {/* Navigasi Tab Pilihan */}
      <ul className="nav nav-tabs" style={{ marginBottom: '25px', fontSize: '16px' }}>
        <li className={activeTab === 'manual' ? 'active' : ''}>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('manual'); }} style={{ cursor: 'pointer', borderRadius: '8px 8px 0 0' }}>
            <span className="material-icons notranslate" translate="no" style={iconStyle}>edit_document</span>
            Upload Manual
          </a>
        </li>
        <li className={activeTab === 'txt' ? 'active' : ''}>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('txt'); }} style={{ cursor: 'pointer', borderRadius: '8px 8px 0 0' }}>
            <span className="material-icons notranslate" translate="no" style={iconStyle}>post_add</span>
            Import data.txt
          </a>
        </li>
      </ul>

      {/* Notifikasi Global (Berhasil/Gagal) */}
      {message && (
        <div className={`alert alert-${msgType}`} role="alert" style={{ borderRadius: '6px', fontSize: '15px', display: 'flex', alignItems: 'center' }}>
          <span className="material-icons notranslate" translate="no" style={iconStyle}>
            {msgType === 'danger' ? 'error_outline' : 'check_circle_outline'}
          </span>
          {message}
        </div>
      )}

      {/* =========================================
          KONTEN TAB: UPLOAD MANUAL
          ========================================= */}
      {activeTab === 'manual' && (
        <div className="panel panel-primary" style={cardStyle}>
          <div className="panel-heading" style={{ padding: '15px 20px' }}>
            <h3 className="panel-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons notranslate" translate="no" style={iconStyle}>video_file</span>
              Form Video Baru
            </h3>
          </div>
          <div className="panel-body" style={{ padding: '25px' }}>
            <form onSubmit={handleManualSubmit}>
              <div className="form-group">
                <label>Judul Video</label>
                <div className="input-group">
                  <span className="input-group-addon"><span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>title</span></span>
                  <input type="text" className="form-control input-lg" required placeholder="Masukkan judul..." style={{ fontSize: '15px' }} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>URL Embed Video</label>
                <div className="input-group">
                  <span className="input-group-addon"><span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>link</span></span>
                  <input type="url" className="form-control input-lg" required placeholder="https://..." style={{ fontSize: '15px' }} />
                </div>
              </div>
              
              <div className="well" style={{ marginTop: '25px', backgroundColor: '#f9f9f9', border: '1px dashed #ccc' }}>
                <label><span className="material-icons notranslate" translate="no" style={iconStyle}>image</span> Thumbnail Gambar (Opsional)</label>
                <div className="row" style={{ marginTop: '10px' }}>
                  <div className="col-md-6">
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '5px' }}>Pilih file gambar:</p>
                    <input type="file" accept="image/*" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '5px' }}>Atau masukkan URL gambar:</p>
                    <input type="url" className="form-control" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '30px', borderRadius: '6px', fontWeight: 'bold' }}>
                <span className="material-icons notranslate" translate="no" style={iconStyle}>save</span>
                Simpan ke Database
              </button>
            </form>

            {/* Area Hasil & Tombol Copy */}
            {manualResultUrl && (
              <div className="alert alert-success" style={{ marginTop: '25px', marginBottom: 0, border: '1px solid #d6e9c6' }}>
                <p style={{ marginBottom: '10px' }}><strong><span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', verticalAlign: 'middle' }}>task_alt</span> Berhasil!</strong> Link video Anda sudah siap:</p>
                <div className="input-group">
                  <input type="text" className="form-control" readOnly value={manualResultUrl} style={{ backgroundColor: '#fff', cursor: 'text' }} />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="button" onClick={handleCopy} style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', marginRight: '5px' }}>
                        {copySuccess ? 'done_all' : 'content_copy'}
                      </span>
                      {copySuccess ? 'Tercopy' : 'Copy'}
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          KONTEN TAB: UPLOAD TXT
          ========================================= */}
      {activeTab === 'txt' && (
        <div className="panel panel-success" style={cardStyle}>
          <div className="panel-heading" style={{ padding: '15px 20px' }}>
            <h3 className="panel-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons notranslate" translate="no" style={iconStyle}>snippet_folder</span>
              Import Data Massal
            </h3>
          </div>
          <div className="panel-body" style={{ padding: '25px' }}>
            <form onSubmit={handleTxtSubmit}>
              <div className="form-group">
                <label style={{ fontSize: '16px' }}>Pilih File Text (.txt)</label>
                <input type="file" accept=".txt" className="form-control input-lg" required style={{ padding: '10px', height: 'auto' }} />
                
                <div className="alert alert-warning" style={{ marginTop: '15px', padding: '10px', fontSize: '13px' }}>
                  <strong><span className="material-icons notranslate" translate="no" style={{ fontSize: '16px', verticalAlign: 'middle' }}>info</span> Aturan Format Wajib:</strong><br/>
                  Setiap baris harus dipisah dengan lambang pipa ( <code>|</code> ) menjadi tepat 6 bagian:<br/>
                  <code style={{ display: 'block', marginTop: '8px', backgroundColor: '#fff', border: '1px solid #ccc' }}>ID | Title | Duration | Publish date, time | Embed code | Main thumbnail</code>
                </div>
              </div>
              <button type="submit" className="btn btn-success btn-lg btn-block" style={{ marginTop: '20px', borderRadius: '6px', fontWeight: 'bold' }}>
                <span className="material-icons notranslate" translate="no" style={iconStyle}>upload_file</span>
                Proses & Ekstrak Data
              </button>
            </form>

            {/* Area Laporan/Notif Hasil TXT */}
            {txtStats && (
              <div className="alert alert-info" style={{ marginTop: '25px', marginBottom: 0, border: '1px solid #bce8f1', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0, borderBottom: '1px solid #9acfea', paddingBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <span className="material-icons notranslate" translate="no" style={iconStyle}>analytics</span>
                  Laporan Database
                </h4>
                <ul style={{ marginBottom: 0, fontSize: '15px', lineHeight: '2' }}>
                  <li>Berhasil ditambahkan: <strong className="text-success">{txtStats.added} video</strong></li>
                  <li>Duplikat ditolak: <strong className="text-danger">{txtStats.duplicates} ID</strong></li>
                  <li>Total video di database: <strong className="text-primary">{txtStats.total} video</strong></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
