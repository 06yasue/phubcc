"use client";
import { useState, useEffect } from 'react';
// Tambahan fungsi deleteAllTxtVideos dari actions
import { getVideos, deleteVideo, deleteAllTxtVideos } from './actions';
import siteConfig from '@/config';

export default function ListPage() {
  const [activeTab, setActiveTab] = useState('manual');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Total Video
  const [totalVideos, setTotalVideos] = useState(0);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Notification State
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // State untuk loading Hapus Semua
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Ambil data setiap kali Tab atau Halaman berubah
  useEffect(() => {
    fetchVideos(activeTab, page);
  }, [activeTab, page]);

  const fetchVideos = async (type, currentPage) => {
    setIsLoading(true);
    const res = await getVideos(type, currentPage, 12); // 12 video per halaman
    if (res.success) {
      setVideos(res.videos);
      setTotalPages(res.totalPages);
      // Asumsi dari actions akan mengirimkan 'total'
      setTotalVideos(res.total || 0); 
    } else {
      showNotif('Gagal mengambil data dari database', 'danger');
    }
    setIsLoading(false);
  };

  const showNotif = (text, type) => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCopy = (id_video) => {
    const shortUrl = `https://${siteConfig.domain}/${id_video}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id_video);
    showNotif('Link berhasil dicopy!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id_video) => {
    if (!window.confirm('Yakin ingin menghapus video ini secara permanen?')) return;
    
    setDeletingId(id_video);
    const res = await deleteVideo(activeTab, id_video);
    
    if (res.success) {
      showNotif('Video berhasil dihapus.', 'success');
      setVideos(videos.filter(v => v.id_video !== id_video));
      setTotalVideos(prev => prev - 1); // Kurangi total secara real-time
    } else {
      showNotif('Gagal menghapus video.', 'danger');
    }
    setDeletingId(null);
  };

  // FUNGSI BARU: Hapus Semua Data TXT
  const handleDeleteAllTxt = async () => {
    if (!window.confirm('⚠️ PERINGATAN BAHAYA: Yakin mau menghapus SEMUA video dari Data TXT? Aksi ini tidak bisa dibatalkan bos!')) return;
    
    // Konfirmasi kedua biar gak kepencet gak sengaja
    if (!window.confirm('Serius nih mau dihapus semua sampai bersih?')) return;

    setIsDeletingAll(true);
    const res = await deleteAllTxtVideos(); // Memanggil fungsi baru di actions.js

    if (res.success) {
      showNotif('BOM! Semua data TXT berhasil diratakan dengan tanah.', 'success');
      setVideos([]); // Kosongkan layar
      setTotalVideos(0);
      setTotalPages(1);
      setPage(1);
    } else {
      showNotif('Gagal menghapus semua data: ' + res.error, 'danger');
    }
    setIsDeletingAll(false);
  };

  // Gaya CSS Inline
  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    marginBottom: '20px',
    transition: 'transform 0.2s',
    border: '1px solid #f1f5f9'
  };

  const imgContainer = {
    width: '100%',
    paddingTop: '56.25%', // Rasio 16:9
    position: 'relative',
    backgroundColor: '#1e293b'
  };

  const imgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '80px' }}>
      
      {/* HEADER AREA (Sudah dimodifikasi tambah Total & Delete All) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ margin: 0, fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '32px', color: '#8b5cf6', marginRight: '10px' }}>video_library</span>
          Database Video
        </h2>

        {/* Info Box Kanan: Total & Tombol Hapus Semua */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Lencana Total Video */}
          <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', border: '1px solid #c7d2fe' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', marginRight: '5px' }}>bar_chart</span>
            Total: {totalVideos}
          </div>

          {/* Tombol Hapus Semua (HANYA MUNCUL DI TAB TXT) */}
          {activeTab === 'txt' && totalVideos > 0 && (
            <button 
              onClick={handleDeleteAllTxt}
              disabled={isDeletingAll}
              style={{ 
                background: '#ef4444', 
                color: '#fff', 
                padding: '6px 15px', 
                border: 'none', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                fontSize: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                cursor: isDeletingAll ? 'not-allowed' : 'pointer',
                opacity: isDeletingAll ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
              }}
            >
              <span className="material-icons notranslate spin-if-deleting" translate="no" style={{ fontSize: '18px', marginRight: '5px' }}>
                {isDeletingAll ? 'autorenew' : 'delete_sweep'}
              </span>
              {isDeletingAll ? 'Menghapus Semua...' : 'Hapus Semua TXT'}
            </button>
          )}

        </div>
      </div>

      {/* Notifikasi Global */}
      {message && (
        <div style={{
          position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
          background: msgType === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', padding: '12px 20px', borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', fontWeight: '600'
        }}>
          <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px' }}>
            {msgType === 'success' ? 'check_circle' : 'error'}
          </span>
          {message}
        </div>
      )}

      {/* Tab Navigasi */}
      <div style={{ background: '#f1f5f9', padding: '5px', borderRadius: '10px', display: 'inline-flex', marginBottom: '25px', width: '100%', maxWidth: '400px' }}>
        <button onClick={() => { setActiveTab('manual'); setPage(1); }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: activeTab === 'manual' ? '#fff' : 'transparent', color: activeTab === 'manual' ? '#3b82f6' : '#64748b', fontWeight: activeTab === 'manual' ? 'bold' : 'normal', boxShadow: activeTab === 'manual' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '5px' }}>draw</span> Manual
        </button>
        <button onClick={() => { setActiveTab('txt'); setPage(1); }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: activeTab === 'txt' ? '#fff' : 'transparent', color: activeTab === 'txt' ? '#10b981' : '#64748b', fontWeight: activeTab === 'txt' ? 'bold' : 'normal', boxShadow: activeTab === 'txt' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
          <span className="material-icons notranslate" translate="no" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '5px' }}>library_books</span> Data TXT
        </button>
      </div>

      {/* Area Loading */}
      {isLoading ? (
        <div className="text-center" style={{ padding: '50px', color: '#94a3b8' }}>
          <span className="material-icons notranslate spin" translate="no" style={{ fontSize: '40px' }}>autorenew</span>
          <p style={{ marginTop: '10px', fontWeight: '600' }}>Memuat Data...</p>
        </div>
      ) : (
        <>
          {/* Grid Area */}
          <div className="row">
            {videos.length === 0 ? (
              <div className="col-xs-12 text-center" style={{ padding: '40px', color: '#94a3b8' }}>
                <span className="material-icons notranslate" translate="no" style={{ fontSize: '48px' }}>videocam_off</span>
                <p>Belum ada video di database ini.</p>
              </div>
            ) : (
              videos.map((vid) => (
                <div key={vid.id_video} className="col-xs-6 col-md-3">
                  <div style={cardStyle} className="video-card">
                    
                    {/* Thumbnail */}
                    <div style={imgContainer}>
                      {vid.image_url ? (
                        <img src={vid.image_url} alt={vid.title} style={imgStyle} loading="lazy" />
                      ) : (
                        <div style={{...imgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8'}}>
                          <span className="material-icons notranslate" translate="no" style={{ fontSize: '40px' }}>image</span>
                        </div>
                      )}
                      {/* Lencana Hitcount */}
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <span className="material-icons notranslate" translate="no" style={{ fontSize: '12px', marginRight: '4px', color: '#38bdf8' }}>visibility</span>
                        {vid.hitcount || 0}
                      </div>
                    </div>

                    {/* Detail Info */}
                    <div style={{ padding: '12px' }}>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={vid.title}>
                        {vid.title || 'Tanpa Judul'}
                      </h5>
                      
                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span>ID: <strong>{vid.id_video}</strong></span>
                        <span>{vid.created_at ? new Date(vid.created_at).toLocaleDateString('id-ID') : '-'}</span>
                      </div>

                      {/* Tombol Aksi */}
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={() => handleCopy(vid.id_video)}
                          className="btn btn-sm" 
                          style={{ flex: 1, background: copiedId === vid.id_video ? '#10b981' : '#f1f5f9', color: copiedId === vid.id_video ? '#fff' : '#475569', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                          title="Copy Short URL"
                        >
                          <span className="material-icons notranslate" translate="no" style={{ fontSize: '14px' }}>{copiedId === vid.id_video ? 'check' : 'content_copy'}</span>
                        </button>
                        
                        <a 
                          href={vid.embed_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm" 
                          style={{ flex: 1, background: '#eff6ff', color: '#3b82f6', border: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          title="Lihat Embed"
                        >
                          <span className="material-icons notranslate" translate="no" style={{ fontSize: '16px' }}>open_in_new</span>
                        </a>

                        <button 
                          onClick={() => handleDelete(vid.id_video)}
                          disabled={deletingId === vid.id_video}
                          className="btn btn-sm" 
                          style={{ flex: 1, background: '#fef2f2', color: '#ef4444', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                          title="Hapus Video"
                        >
                          <span className="material-icons notranslate spin-if-deleting" translate="no" style={{ fontSize: '16px' }}>
                            {deletingId === vid.id_video ? 'autorenew' : 'delete'}
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '15px' }}>
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
                style={{ padding: '8px 16px', background: page === 1 ? '#e2e8f0' : '#3b82f6', color: page === 1 ? '#94a3b8' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              
              <div style={{ fontWeight: 'bold', color: '#475569', fontSize: '15px' }}>
                {page} / {totalPages}
              </div>

              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages}
                style={{ padding: '8px 16px', background: page === totalPages ? '#e2e8f0' : '#3b82f6', color: page === totalPages ? '#94a3b8' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        .spin-if-deleting { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .video-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
      `}} />
    </div>
  );
}
