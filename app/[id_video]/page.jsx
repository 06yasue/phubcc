// Tambahkan kata "async" di depan function
export default async function VideoPlayerPage({ params }) {
  // Buka paket params dengan "await" (Aturan baru Next.js 15)
  const { id_video } = await params;

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '50px' }}>
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          
          <h3 className="page-header" style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
            <span className="material-icons notranslate" translate="no" style={{ fontSize: '28px', marginRight: '10px', color: '#e50914' }}>movie</span>
            Menonton Video: <small style={{ marginLeft: '8px' }}>{id_video}</small>
          </h3>
          
          {/* Rasio 16:9 Bootstrap 3 untuk Iframe Player */}
          <div className="embed-responsive embed-responsive-16by9" style={{ backgroundColor: '#000', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
            <div className="text-center" style={{ color: '#fff', paddingTop: '22%' }}>
              <span className="material-icons notranslate" translate="no" style={{ fontSize: '64px', color: '#555', marginBottom: '10px' }}>play_circle_outline</span>
              <p style={{ fontSize: '16px', color: '#aaa' }}>
                Player video untuk ID <strong style={{ color: '#fff' }}>{id_video}</strong> akan dimuat di sini.
              </p>
              {/* Nantinya iframe embed dipanggil ke sini */}
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '15px 20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #e3e3e3' }}>
            <p className="text-muted" style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: '15px' }}>
              <span className="material-icons notranslate" translate="no" style={{ marginRight: '8px', fontSize: '22px', color: '#337ab7' }}>visibility</span> 
              Hitcount: <strong style={{ color: '#333', marginLeft: '5px', marginRight: '5px' }}>0</strong> Penonton
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
