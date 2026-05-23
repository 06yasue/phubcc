import { turso } from '@/lib/turso';
import siteConfig from '@/config';

// ==========================================
// GENERATE METADATA DYNAMIC HALAMAN VIP PLAYER (SEO MAX)
// ==========================================
export async function generateMetadata({ params }) {
  const { tube_param } = await params;
  
  // Ekstrak id_video asli dari parameter tube_param (misal: tube_zedr -> zedr)
  const id_video = tube_param ? tube_param.replace('tube_', '') : '';

  let videoTitle = 'Premium Video Player';
  let videoImage = `https://${siteConfig.domain}/logo.png`; // Fallback image jika kosong

  if (id_video) {
    try {
      // 1. Ambil data dari tabel video_manual terlebih dahulu
      const resManual = await turso.execute({ 
        sql: "SELECT title, image_url FROM video_manual WHERE id_video = ?", 
        args: [id_video] 
      });

      if (resManual.rows.length > 0) {
        videoTitle = resManual.rows[0].title;
        if (resManual.rows[0].image_url) {
          videoImage = resManual.rows[0].image_url;
        }
      } else {
        // 2. Jika tidak ada, ambil data dari tabel video_txt
        const resTxt = await turso.execute({ 
          sql: "SELECT title, main_thumbnail FROM video_txt WHERE id_video = ?", 
          args: [id_video] 
        });
        
        if (resTxt.rows.length > 0) {
          videoTitle = resTxt.rows[0].title;
          if (resTxt.rows[0].main_thumbnail) {
            videoImage = resTxt.rows[0].main_thumbnail;
          }
        }
      }
    } catch (error) {
      // Kebal error saat database bermasalah agar build aman
    }
  }

  // Struktur Meta Tag Full English untuk mendongkrak CPM dan Crawler Google Global
  return {
    title: `Watch ${videoTitle} Full Premium Video - ${siteConfig.sitename}`,
    description: `Stream and download ${videoTitle} online in ultra high quality on ${siteConfig.sitename}. Enjoy full length premium videos safely without interruptions.`,
    
    // Open Graph Full Spec (WA, FB, Telegram Preview)
    openGraph: {
      title: `Watch ${videoTitle} Full Premium Video`,
      description: `Stream ${videoTitle} in high quality exclusively on ${siteConfig.sitename}.`,
      url: `https://${siteConfig.domain}/${tube_param}`,
      siteName: siteConfig.sitename,
      images: [
        {
          url: videoImage,
          width: 1280,
          height: 720,
          alt: `${videoTitle} Streaming Preview`,
        },
      ],
      locale: 'en_US',
      type: 'video.other',
    },

    // Twitter Card Full Spec (Gambar Besar di X/Twitter)
    twitter: {
      card: 'summary_large_image',
      title: `Watch ${videoTitle} - ${siteConfig.sitename}`,
      description: `Stream ${videoTitle} in full high quality video on ${siteConfig.sitename}.`,
      images: [videoImage],
    },
  };
}

export default function VideoPlayerLayout({ children }) {
  return (
    <>
      {/* Seluruh isi komponen page.jsx dalam rute ini otomatis dirender disini */}
      {children}
    </>
  );
}
