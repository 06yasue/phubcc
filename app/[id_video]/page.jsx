export default function VideoPlayerPage({ params }) {
  // params.id_video akan berisi "abc123" sesuai URL
  const { id_video } = params;

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          
          <h3 className="page-header" style={{ marginTop: 0 }}>
            Menonton Video: <small>{id_video}</small>
          </h3>
          
          {/* Rasio 16:9 Bootstrap 3 untuk Iframe Player */}
          <div className="embed-responsive embed-responsive-16by9" style={{ backgroundColor: '#000', borderRadius: '4px' }}>
            <div className="text-center" style={{ color: '#fff', paddingTop: '25%' }}>
              <p>Player video untuk ID <strong>{id_video}</strong> akan dimuat di sini.</p>
              {/* Nantinya iframe embed dipanggil ke sini */}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p className="text-muted"><span className="glyphicon glyphicon-eye-open"></span> Hitcount: 0 Penonton</p>
          </div>

        </div>
      </div>
    </div>
  );
}
