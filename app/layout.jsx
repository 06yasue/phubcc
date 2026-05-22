import Footer from '../components/Footer';

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
        {/* Konten tiap halaman akan dirender di sini */}
        <div style={{ minHeight: '80vh' }}>
          {children}
        </div>
        {/* Footer ada di semua halaman */}
        <Footer />
      </body>
    </html>
  );
}
