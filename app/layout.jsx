import { headers } from 'next/headers';
import './global.css';
import Footer from '@/components/Footer';
import siteConfig from '@/config';

export const metadata = {
  title: `${siteConfig.sitename} - Premium Video Streaming`,
  description: `Discover and stream the best premium video content on ${siteConfig.sitename}. Enjoy high-quality streaming securely at ${siteConfig.domain}.`,
  
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  
  openGraph: {
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Discover and stream the best premium video content on ${siteConfig.sitename}.`,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.sitename,
    images: [
      {
        url: '/oge.png',
        width: 800,
        height: 600,
        alt: `${siteConfig.sitename} Thumbnail`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.sitename} - Premium Video Content`,
    description: `Stream the best content directly on ${siteConfig.sitename}.`,
    images: ['/oge.png'],
  },
};

// 1. TAMBAHKAN KATA "async" DI SINI
export default async function RootLayout({ children }) {
  
  // 2. TAMBAHKAN KATA "await" DI SINI
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Daftar halaman yang HARUS BERSIH dari iklan
  const blockedPages = ['/settings', '/list', '/upload', '/login'];
  
  // Cek apakah halaman yang diakses termasuk yang diblokir
  const isBlocked = blockedPages.some((page) => pathname.startsWith(page));

  return (
    <html lang="en">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
        
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: 'Noto Sans JP', sans-serif !important;
            }
          `
        }} />

        {/* Cuma dirender di HTML mentah kalau bukan di halaman yang diblokir */}
        {!isBlocked && (
          <>
            <meta name="monetag" content="9d92bc323e751103d22575df3a119344" />
            <script 
              src="https://quge5.com/88/tag.min.js" 
              data-zone="242410" 
              async 
              data-cfasync="false"
            ></script>

            {/* 2. ADS BARU (al5sm.com) */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(s){s.dataset.zone='11049543',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
              }}
            />
          </>
        )}
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
