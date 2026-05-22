import './global.css';
import Footer from '@/components/Footer';
import siteConfig from '@/config';

// ==========================================
// SETTING SEO LENGKAP (AUTO GENERATE DARI NEXT.JS)
// ==========================================
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
        url: '/logo.png', // Gambar otomatis muncul pas share link
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
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Jangan masukin tag <head> manual di sini biar gak bentrok sama metadata! */}
      <body>
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
