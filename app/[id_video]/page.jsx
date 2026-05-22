import { turso } from '@/lib/turso';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FakeVideoPage({ params }) {
  const { id_video } = await params;

  let videoData = null;
  let thumbUrl = '';

  // 1. CARI DATA VIDEO INI (100% KODE ASLI LO)
  const resManual = await turso.execute({ sql: "SELECT * FROM video_manual WHERE id_video = ?", args: [id_video] });
  if (resManual.rows.length > 0) {
    videoData = resManual.rows[0];
    thumbUrl = videoData.image_url || 'https://via.placeholder.com/800x450/1e293b/ffffff?text=Video+Player';
  } else {
    const resTxt = await turso.execute({ sql: "SELECT * FROM video_txt WHERE id_video = ?", args: [id_video] });
    if (resTxt.rows.length > 0) {
      videoData = resTxt.rows[0];
      thumbUrl = videoData.main_thumbnail;
    }
  }

  if (!videoData) notFound();

  // 2. AMBIL 20 VIDEO ACAK UNTUK "POPULER" (100% KODE ASLI LO)
  const randManual = await turso.execute("SELECT id_video, title, image_url as thumb FROM video_manual ORDER BY RANDOM() LIMIT 20");
  const randTxt = await turso.execute("SELECT id_video, title, main_thumbnail as thumb FROM video_txt ORDER BY RANDOM() LIMIT 20");
  
  let randomVideos = [...randManual.rows, ...randTxt.rows];
  randomVideos = randomVideos.sort(() => 0.5 - Math.random()).slice(0, 20);

  // 3. SERVER ACTION: FUNGSI TOMBOL PLAY (100% KODE ASLI LO)
  async function grantAccess() {
    'use server';
    (await cookies()).set(`access_${id_video}`, 'granted', { maxAge: 900 });
    const slugTitle = videoData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'video';
    redirect(`/tube_${id_video}/${slugTitle}`);
  }

  // 4. TAMPILAN UI (DIRAPIHKAN TANPA MERUBAH FUNGSI)

return (
  <div
    className="container"
    style={{
      marginTop: '20px',
      marginBottom: '60px',
      maxWidth: '1100px',
    }}
  >
    {/* STYLE */}
    <style>{`
      .video-page {
        font-family: Arial, sans-serif;
      }

      .video-card-hover {
        transition: all .25s ease;
      }

      .video-card-hover:hover {
        transform: translateY(-4px);
      }

      .main-video-box {
        border-radius: 18px;
        overflow: hidden;
        position: relative;
        background: #000;
        box-shadow: 0 15px 40px rgba(0,0,0,0.25);
      }

      .play-button-big {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 95px;
        height: 95px;
        border-radius: 50%;
        background: rgba(255,0,0,.9);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .25s ease;
        box-shadow: 0 0 25px rgba(255,0,0,.45);
      }

      .main-video-box:hover .play-button-big {
        transform: translate(-50%, -50%) scale(1.08);
        background: #ff0000;
      }

      .video-info-box {
        background: #fff;
        border-radius: 16px;
        padding: 18px;
        margin-top: 18px;
        box-shadow: 0 5px 25px rgba(0,0,0,.05);
      }

      .video-title {
        font-size: 28px;
        font-weight: 800;
        color: #111827;
        line-height: 1.4;
        margin: 0 0 12px;
      }

      .video-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        color: #64748b;
        font-size: 14px;
      }

      .ads-box {
        margin-top: 30px;
        margin-bottom: 35px;
        border-radius: 16px;
        padding: 30px 20px;
        text-align: center;
        background: linear-gradient(to right, #f8fafc, #eef2ff);
        border: 2px dashed #cbd5e1;
      }

      .popular-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 22px;
        font-size: 24px;
        font-weight: 800;
        color: #111827;
      }

      .video-grid-card {
        background: #fff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 5px 18px rgba(0,0,0,.06);
        transition: .25s ease;
        height: 100%;
      }

      .video-grid-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,.12);
      }

      .video-thumb {
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        background: #111827;
        overflow: hidden;
      }

      .video-thumb img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .play-small {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(0,0,0,.7);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .video-card-body {
        padding: 12px;
      }

      .video-card-title {
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.5;
        height: 42px;
        overflow: hidden;
      }

      .watch-button {
        margin-top: 12px;
        width: 100%;
        border: none;
        background: linear-gradient(to right, #ef4444, #dc2626);
        color: #fff;
        font-weight: 700;
        padding: 14px;
        border-radius: 12px;
        font-size: 16px;
        transition: .25s ease;
      }

      .watch-button:hover {
        opacity: .92;
      }

      @media (max-width: 768px) {
        .video-title {
          font-size: 22px;
        }

        .play-button-big {
          width: 75px;
          height: 75px;
        }

        .play-button-big .material-icons {
          font-size: 50px !important;
        }

        .popular-title {
          font-size: 20px;
        }

        .video-card-title {
          font-size: 13px;
        }
      }
    `}</style>

    <div className="video-page">

      {/* TITLE */}
      <div className="video-info-box">
        <h1 className="video-title">
          {videoData.title}
        </h1>

        <div className="video-meta">
          <span
            className="material-icons notranslate"
            translate="no"
            style={{ fontSize: '18px', color: '#3b82f6' }}
          >
            visibility
          </span>

          <span>
            {videoData.hitcount} Views
          </span>

          <span>•</span>

          <span style={{ color: '#10b981', fontWeight: '700' }}>
            HD Quality
          </span>
        </div>
      </div>

      {/* VIDEO PLAYER */}
      <form action={grantAccess} style={{ marginTop: '20px' }}>
        <button
          type="submit"
          style={{
            width: '100%',
            border: 'none',
            padding: 0,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <div className="main-video-box">

            <div
              style={{
                width: '100%',
                paddingTop: '56.25%',
                position: 'relative',
              }}
            >
              <img
                src={thumbUrl}
                alt="Thumbnail"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: '.88',
                }}
              />

              {/* OVERLAY */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.15))',
                }}
              />

              {/* PLAY BUTTON */}
              <div className="play-button-big">
                <span
                  className="material-icons notranslate"
                  translate="no"
                  style={{
                    fontSize: '65px',
                    color: '#fff',
                    marginLeft: '4px',
                  }}
                >
                  play_arrow
                </span>
              </div>

              {/* BOTTOM BAR */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,.25)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '35%',
                      height: '100%',
                      background:
                        'linear-gradient(to right,#ef4444,#dc2626)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="watch-button">
            ▶ TONTON SEKARANG
          </button>
        </button>
      </form>

      {/* ADS */}
      <div className="ads-box">
        <span
          className="material-icons notranslate"
          translate="no"
          style={{
            fontSize: '42px',
            color: '#6366f1',
          }}
        >
          monetization_on
        </span>

        <h4
          style={{
            marginTop: '10px',
            fontWeight: '800',
            color: '#1e293b',
          }}
        >
          Area Iklan Responsive
        </h4>

        <p
          style={{
            color: '#64748b',
            marginBottom: 0,
          }}
        >
          Support MGID / Adsterra / Adsense
        </p>
      </div>

      {/* POPULAR */}
      <div className="popular-title">
        <span
          className="material-icons notranslate"
          translate="no"
          style={{
            color: '#ef4444',
          }}
        >
          local_fire_department
        </span>

        Video Populer Lainnya
      </div>

      <div className="row">
        {randomVideos.map((vid, idx) => (
          <div
            key={idx}
            className="col-xs-6 col-sm-4 col-md-3"
            style={{ marginBottom: '22px' }}
          >
            <Link
              href={`/${vid.id_video}`}
              style={{
                textDecoration: 'none',
              }}
            >
              <div className="video-grid-card video-card-hover">

                {/* THUMB */}
                <div className="video-thumb">
                  {vid.thumb ? (
                    <img src={vid.thumb} alt={vid.title} />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <div className="play-small">
                    <span
                      className="material-icons notranslate"
                      translate="no"
                      style={{
                        fontSize: '18px',
                        color: '#fff',
                      }}
                    >
                      play_arrow
                    </span>
                  </div>
                </div>

                {/* BODY */}
                <div className="video-card-body">
                  <div className="video-card-title">
                    {vid.title || 'Video Tanpa Judul'}
                  </div>
                </div>

              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  </div>
);
