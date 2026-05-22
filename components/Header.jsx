import Link from 'next/link';

export default function Header() {
  return (
    <nav className="navbar navbar-default" style={{ borderRadius: 0, marginBottom: 0 }}>
      <div className="container">
        <div className="navbar-header">
          <Link href="/" className="navbar-brand">
            <b>VideoApp</b>
          </Link>
        </div>
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li>
              <Link href="/upload">Upload</Link>
            </li>
            {/* Nanti menu list & setting bisa ditambah di sini */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
