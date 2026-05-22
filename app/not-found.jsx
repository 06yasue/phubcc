import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container text-center" style={{ marginTop: '100px' }}>
      <h1 style={{ fontSize: '72px' }}>404</h1>
      <p className="lead">Maaf, halaman atau video yang Anda cari tidak ditemukan.</p>
      <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: '20px' }}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
