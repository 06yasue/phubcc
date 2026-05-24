import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Ambil headers bawaan dan sisipkan pathname saat ini
  // Ini berguna agar layout.jsx tahu di halaman mana user berada
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 2. Tentukan daftar halaman yang DIKUNCI (Protected Routes)
  const isProtectedRoute = pathname.startsWith('/settings') || 
                           pathname.startsWith('/list') || 
                           pathname.startsWith('/upload');

  // 3. Cek apakah pengunjung punya tiket/cookie 'admin_session'
  const session = request.cookies.get('admin_session');

  // 4. Kalau pengunjung mengakses halaman terkunci TAPI tidak punya tiket, tendang ke login!
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 5. Kalau aman (halaman publik atau admin yang sudah login), 
  // teruskan request beserta custom headers berisi pathname tadi
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ==========================================
// MATCHER (PENGATURAN AREA AKTIF MIDDLEWARE)
// ==========================================
// Jalankan middleware ini di SEMUA rute, KECUALI file aset statis dan API,
// agar performa website tetap ringan dan optimal.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
