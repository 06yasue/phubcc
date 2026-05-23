import './global.css';
import Footer from '@/components/Footer';
import siteConfig from '@/config';
import MonetagAds from '@/components/MonetagAds';

export const metadata = {
  title: `${siteConfig.sitename} - Premium Video Streaming`,
  description: `Discover and stream the best premium video content on ${siteConfig.sitename}. Enjoy high-quality streaming securely at ${siteConfig.domain}.`,
  
  // Ikon tab browser (Favicon)
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  
  // Open Graph (Buat preview link di WA, FB, Telegram)
  openGraph: {
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Discover and stream the best premium video content on ${siteConfig.sitename}.`,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.sitename,
    images: [
      {
        url: '/oge.png', // Gambar otomatis muncul pas share link
        width: 800,
        height: 600,
        alt: `${siteConfig.sitename} Thumbnail`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card (Buat preview di Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Stream the best content directly on ${siteConfig.sitename}.`,
    images: ['/oge.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
       {/* ========================================== */}
        {/* PENGATURAN GOOGLE FONTS: Noto Sans JP       */}
        {/* ========================================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
        
        {/* Memanggil Bootstrap 3 dan Google Icons via CDN */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        {/* Script jQuery & Bootstrap untuk dukung fungsionalitas klasik (jika ada) */}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        {/* Timpa font bawaan Bootstrap dengan Noto Sans JP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: 'Noto Sans JP', sans-serif !important;
            }
          `
        }} />

        <meta name="monetag" content="9d92bc323e751103d22575df3a119344" />
        <MonetagAds />
       </head>
      <body>
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

