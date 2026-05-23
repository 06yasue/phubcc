import { turso } from '@/lib/turso';
import siteConfig from '@/config';

// ==========================================
// GENERATE METADATA DYNAMIC UNTUK SEO VIDEO
// ==========================================
export async function generateMetadata({ params }) {
  const { id_video } = await params;

  let videoTitle = 'Premium Video';
  let videoImage = `https://${siteConfig.domain}/logo.png`; // Fallback image kalau thumbnail kosong

  try {
    // 1. Cari judul dan thumbnail di tabel video_manual
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
      // 2. Jika tidak ada, cari di tabel video_txt
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
    // Fallback jika database bermasalah agar build tidak gagal
  }

  // Kombinasi judul dan gambar video dengan Meta Tag SEO Full English
  return {
    title: `${videoTitle} - Watch Free Premium Videos on ${siteConfig.sitename}`,
    description: `Stream ${videoTitle} full video in high quality exclusively on ${siteConfig.sitename}. Discover more premium content and secure streaming on our platform.`,
    
    // Open Graph (Buat preview gambar besar di WA, FB, Telegram, dll)
    openGraph: {
      title: `${videoTitle} - ${siteConfig.sitename}`,
      description: `Watch ${videoTitle} full video in high quality on ${siteConfig.sitename}.`,
      url: `https://${siteConfig.domain}/${id_video}`,
      siteName: siteConfig.sitename,
      images: [
        {
          url: videoImage,
          width: 1280,
          height: 720,
          alt: `${videoTitle} Thumbnail`,
        },
      ],
      locale: 'en_US',
      type: 'video.movie',
    },

    // Twitter Card (Buat preview gambar besar di Twitter/X)
    twitter: {
      card: 'summary_large_image',
      title: `${videoTitle} - ${siteConfig.sitename}`,
      description: `Stream ${videoTitle} full video in high quality on ${siteConfig.sitename}.`,
      images: [videoImage],
    },
  };
}

export default function VideoDetailLayout({ children }) {
  return (
    <>
      {/* Konten halaman page.jsx video akan otomatis dirender di sini */}
      {children}
    </>
  );
}
