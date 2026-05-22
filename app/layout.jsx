import './global.css';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'VideoApp',
  description: 'Project Video dengan Next.js dan Turso',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Load Bootstrap 3 dari CDN */}
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
        />
      </head>
      <body>
        {/* Konten dari tiap halaman (page.jsx) akan dirender di dalam div ini */}
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        
        {/* Footer akan otomatis selalu muncul di bagian bawah setiap halaman */}
        <Footer />
      </body>
    </html>
  );
}
