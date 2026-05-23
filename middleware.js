import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Cek apakah pengunjung punya tiket/cookie 'admin_session'
  const session = request.cookies.get('admin_session');

  // 2. Kalau dia gak punya tiket, tendang balik ke halaman login!
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Kalau punya tiket, silakan masuk bosku
  return NextResponse.next();
}

// ==========================================
// DAFTAR HALAMAN YANG MAU DIKUNCI (PROTECTED ROUTES)
// ==========================================
export const config = {
  matcher: [
    '/settings/:path*', 
    '/list/:path*', 
    '/upload/:path*'
  ],
};
