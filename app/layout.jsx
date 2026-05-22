import './global.css';
import Footer from '@/components/Footer';
import siteConfig from '@/config'; // Panggil config biar SEO-nya dinamis

// ==========================================
// SETTING SEOT (SUPER LENGKAP & DINAMIS)
// ==========================================
export const metadata = {
  title: `${siteConfig.sitename} - Premium Video Content`,
  description: `Discover and stream the best premium video content on ${siteConfig.sitename}. Enjoy high-quality streaming securely at ${siteConfig.domain}.`,
  
  // Ikon tab browser (Favicon) ngambil dari logo.png di folder public
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  
  // Open Graph (Biar cantik pas di-share ke WA / Facebook / Telegram)
  openGraph: {
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Discover and stream the best premium video content on ${siteConfig.sitename}. Enjoy high-quality streaming securely at ${siteConfig.domain}.`,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.sitename,
    images: [
      {
        url: '/logo.png', // Gambar preview pas di-share
        width: 800,
        height: 600,
        alt: `${siteConfig.sitename} Thumbnail`,
      },
    ],
    locale: 'en_US', // Karena deskripsi bahasa Inggris, SEO targetnya English
    type: 'website',
  },
  
  // Twitter Card (Biar cantik pas di-share ke Twitter/X)
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Discover and stream the best premium video content on ${siteConfig.sitename}. Enjoy high-quality streaming securely at ${siteConfig.domain}.`,
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    // Ubah lang jadi "en" biar sinkron sama deskripsi SEO bahasa Inggris
    <html lang="en">
      <head>
        {/* ========================================== */}
        {/* FONT GOOGLE: Noto Sans JP                   */}
        {/* ========================================== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />

        {/* Load Bootstrap 3 dari CDN */}
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
        />
        {/* Load Google Material Icons */}
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet" 
        />
      </head>
      
      {/* Terapkan font Noto Sans JP ke seluruh body website */}
      <body style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
