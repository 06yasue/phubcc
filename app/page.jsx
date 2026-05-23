'use client';
import { useState, useEffect, useRef } from 'react';
import siteConfig from '@/config';
import { getOfferLink } from './home-actions';
// Pastikan path Footer ini sesuai sama struktur folder lo ya bos
import Footer from '@/components/Footer'; 

export default function HomePage() {
  const [offerLink, setOfferLink] = useState('#');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success'
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef(null);

  // Narik link offer dari database pas halaman pertama kali dibuka
  useEffect(() => {
    async function fetchLink() {
      const link = await getOfferLink();
      setOfferLink(link);
    }
    fetchLink();
  }, []);

  // Animasi Progress Bar pakai React way
  useEffect(() => {
    let interval;
    if (uploadState === 'uploading') {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 10) + 5;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadState('success'), 600);
            return 100;
          }
          return next;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [uploadState]);

  const handleFakeUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setIsModalOpen(true);
      setUploadState('uploading');
      setProgress(0);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setUploadState('idle');
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 300);
  };

  return (
    <>
      {/* KONTEN UTAMA */}
      <div className="container main-wrapper">
        <div className="row">
          
          {/* Bagian Kiri */}
          <div className="col-xs-12 col-md-6 content-column">
            <span className="brand-name">{siteConfig.name}</span>
            <h1 className="main-headline">
              Enterprise Video Delivery at <span className="domain-highlight">{siteConfig.domain}</span>.
            </h1>
            
            <div className="upload-action-area">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="video/*" 
                onChange={handleFileChange}
              />
              <button className="btn-primary-action" onClick={handleFakeUploadClick}>
                <span className="material-icons" translate="no">cloud_upload</span>
                Select Video File
              </button>
              <span className="upload-hint">MP4, MOV, AVI up to 4K</span>
            </div>

            <div className="article-content">
              <h2 className="article-title">Seamless Global Infrastructure</h2>
              <p className="article-text">
                In today's highly competitive digital landscape, video playback latency is the primary metric for user retention. We engineered a proprietary <em>Content Delivery Network</em> (CDN) explicitly optimized for global video-on-demand (VOD) streaming workloads. When you host a media file on <strong>{siteConfig.name}</strong>, it is instantly distributed across our high-bandwidth edge nodes.
              </p>
              <p className="article-text">
                Our core engine utilizes <strong>lossless multi-bitrate transcoding</strong>. Every visual frame is analyzed and intelligently compressed to accelerate loading times without compromising the original pixel resolution. Fortified with AES-128 encryption protocols, your intellectual property remains fully protected from unauthorized access or third-party scraping at <strong>{siteConfig.domain}</strong>.
              </p>
            </div>
          </div>

          {/* Bagian Kanan (SVG) */}
          <div className="col-xs-12 col-md-6 visual-column">
            <svg className="svg-hero" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="450" cy="250" r="150" fill="#4f46e5" fillOpacity="0.05" />
              <rect x="50" y="80" width="460" height="280" rx="16" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2"/>
              <rect x="60" y="90" width="440" height="200" rx="8" fill="#111827"/>
              <path d="M60 290 Q 150 150 280 290 T 500 150 L 500 290 Z" fill="#374151" fillOpacity="0.4"/>
              <circle cx="280" cy="190" r="32" fill="#4f46e5"/>
              <path d="M272 178 L294 190 L272 202 Z" fill="#ffffff"/>
              <rect x="60" y="310" width="340" height="6" rx="3" fill="#f3f4f6"/>
              <rect x="60" y="310" width="180" height="6" rx="3" fill="#4f46e5"/>
              <circle cx="240" cy="313" r="6" fill="#111827"/>
              <rect x="420" y="310" width="80" height="6" rx="3" fill="#f3f4f6"/>
              
              <rect x="420" y="240" width="160" height="60" rx="8" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2"/>
              <rect x="435" y="255" width="30" height="30" rx="6" fill="#f3f4f6"/>
              <path d="M444 270 L450 276 L456 264" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="480" y="260" width="80" height="6" rx="3" fill="#e5e7eb"/>
              <rect x="480" y="274" width="50" height="6" rx="3" fill="#f3f4f6"/>
              
              <rect x="380" y="30" width="140" height="80" rx="8" fill="#111827" opacity="0.95"/>
              <circle cx="395" cy="45" r="4" fill="#ef4444"/>
              <circle cx="410" cy="45" r="4" fill="#eab308"/>
              <circle cx="425" cy="45" r="4" fill="#22c55e"/>
              <rect x="395" y="65" width="80" height="4" rx="2" fill="#4b5563"/>
              <rect x="395" y="77" width="100" height="4" rx="2" fill="#4b5563"/>
              <rect x="395" y="89" width="60" height="4" rx="2" fill="#4f46e5"/>
            </svg>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* MODAL POPUP */}
      <div className={`custom-overlay ${isModalOpen ? 'active' : ''}`} style={{ display: isModalOpen ? 'flex' : 'none' }}>
        <div className="custom-modal-box">
          <button className="close-modal" onClick={closeModal}>
            <span className="material-icons" translate="no">close</span>
          </button>

          {/* Tampilan Uploading */}
          {uploadState === 'uploading' && (
            <div>
              <span className="material-icons spinner-icon" translate="no">sync</span>
              <h3 className="modal-title">Uploading Video...</h3>
              <p className="modal-desc">Please wait while we process and secure your file.</p>
              
              <div className="progress-container">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text">{progress}%</div>
            </div>
          )}

          {/* Tampilan Selesai & Tombol Offer */}
          {uploadState === 'success' && (
            <div>
              <span className="material-icons success-icon" translate="no">check_circle</span>
              <h3 className="modal-title">Upload Successful!</h3>
              <p className="modal-desc">Your video has been processed. To save this video permanently and generate a sharing link, please create a free account.</p>
              
              {/* Ini link offer yang udah narik dinamis dari Turso bos! */}
              <a href={offerLink} target="_blank" rel="noopener noreferrer" className="btn-primary-action" style={{ width: '100%', marginTop: '10px' }}>
                <span className="material-icons" translate="no" style={{ fontSize: '20px' }}>person_add</span>
                Create Free Account
              </a>
              
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
                By creating an account, you agree to our Terms of Service.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* STYLES CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #ffffff; color: #111827; margin: 0; padding: 0; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        .main-wrapper { padding-top: 10vh; padding-bottom: 8vh; }
        .content-column { padding-right: 50px; }
        .brand-name { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #4f46e5; margin-bottom: 20px; display: block; }
        .main-headline { font-size: 46px; font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; color: #000000; margin: 0 0 20px 0; }
        .domain-highlight { color: #4f46e5; }
        .upload-action-area { margin: 40px 0 50px 0; display: flex; align-items: center; gap: 20px; }
        .btn-primary-action { background-color: #111827; color: #ffffff; border: none; padding: 16px 32px; font-size: 16px; font-weight: 600; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s ease; box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.1); cursor: pointer; text-decoration: none; }
        .btn-primary-action:hover { background-color: #374151; color: #ffffff; transform: translateY(-2px); text-decoration: none; box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15); }
        .btn-primary-action .material-icons { margin-right: 12px; font-size: 22px; }
        .upload-hint { font-size: 14px; color: #6b7280; font-weight: 600; margin-left: 15px; }
        .article-content { margin-top: 20px; }
        .article-title { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 15px; letter-spacing: -0.5px; }
        .article-text { font-size: 16px; line-height: 1.8; color: #4b5563; margin-bottom: 24px; }
        .article-text strong { color: #111827; }
        .visual-column { display: flex; justify-content: center; align-items: center; }
        .svg-hero { width: 100%; max-width: 650px; height: auto; transform: scale(1.05); }
        
        .custom-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(17, 24, 39, 0.7); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); align-items: center; justify-content: center; z-index: 9999; opacity: 0; transition: opacity 0.3s ease; }
        .custom-overlay.active { opacity: 1; }
        .custom-modal-box { background: #ffffff; width: 90%; max-width: 450px; border-radius: 16px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); transform: translateY(20px); transition: transform 0.3s ease; text-align: center; position: relative; }
        .custom-overlay.active .custom-modal-box { transform: translateY(0); }
        
        .spinner-icon { font-size: 48px; color: #4f46e5; animation: spin 1.5s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .modal-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0; }
        .modal-desc { font-size: 14px; color: #6b7280; margin-bottom: 30px; }
        .progress-container { width: 100%; height: 8px; background-color: #f3f4f6; border-radius: 4px; overflow: hidden; margin-bottom: 15px; }
        .progress-fill { height: 100%; background-color: #4f46e5; border-radius: 4px; transition: width 0.4s ease; }
        .progress-text { font-size: 14px; font-weight: 800; color: #4f46e5; }
        .success-icon { font-size: 56px; color: #10b981; margin-bottom: 15px; }
        .close-modal { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #9ca3af; cursor: pointer; padding: 5px; }
        .close-modal:hover { color: #111827; }
        
        @media (max-width: 991px) { .content-column { padding-right: 15px; margin-bottom: 50px; } .main-headline { font-size: 38px; } .svg-hero { transform: scale(1); } }
        @media (max-width: 767px) { .main-wrapper { padding-top: 5vh; padding-bottom: 5vh; } .main-headline { font-size: 32px; } .upload-action-area { flex-direction: column; align-items: flex-start; gap: 15px; } .upload-hint { margin-left: 0; } .btn-primary-action { width: 100%; } .custom-modal-box { padding: 30px 20px; } }
      `}} />
    </>
  );
}
