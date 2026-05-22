"use client";
import { useState } from 'react';

export default function UploadPage() {
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Logika simpan ke Turso nanti di sini
    setMsgType('success');
    setMessage('Video manual berhasil disiapkan!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTxtSubmit = (e) => {
    e.preventDefault();
    // Logika parsing TXT anti-ganda & filter iframe nanti di sini
    setMsgType('info');
    setMessage('File data.txt sedang diproses...');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="page-header">
        <h2>Halaman Upload <small>Manajemen Data Video</small></h2>
      </div>

      {/* Notifikasi pengganti alert() */}
      {message && (
        <div className={`alert alert-${msgType}`} role="alert">
          {message}
        </div>
      )}

      <div className="row">
        {/* Kolom Upload Manual */}
        <div className="col-md-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Upload Video Manual</h3>
            </div>
            <div className="panel-body">
              <form onSubmit={handleManualSubmit}>
                <div className="form-group">
                  <label>Judul Video</label>
                  <input type="text" className="form-control" required placeholder="Masukkan judul..." />
                </div>
                <div className="form-group">
                  <label>URL Embed Video</label>
                  <input type="url" className="form-control" required placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>URL Gambar (Thumbnail)</label>
                  <input type="url" className="form-control" placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Simpan Video</button>
              </form>
            </div>
          </div>
        </div>

        {/* Kolom Upload TXT */}
        <div className="col-md-6">
          <div className="panel panel-success">
            <div className="panel-heading">
              <h3 className="panel-title">Import Data (data.txt)</h3>
            </div>
            <div className="panel-body">
              <form onSubmit={handleTxtSubmit}>
                <div className="form-group">
                  <label>Pilih File .txt</label>
                  <input type="file" accept=".txt" className="form-control" required />
                  <p className="help-block" style={{ fontSize: '12px' }}>
                    Format: <code>ID | Title | Duration | Publish date | Embed code | Main thumbnail</code>
                  </p>
                </div>
                <button type="submit" className="btn btn-success btn-block">Upload & Ekstrak Data</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
