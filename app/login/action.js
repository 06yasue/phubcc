'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticate(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Tarik data dari Vercel Environment Variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPass) {
    return { error: 'System Error: Credentials not configured in Vercel.' };
  }

  if (email === adminEmail && password === adminPass) {
    // Bikin tiket masuk (cookie) tahan 7 hari
    (await cookies()).set('admin_session', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    
    // Sukses? Langsung tendang ke halaman settings
    redirect('/settings');
  } else {
    // Gagal? Balikin pesan error tanpa alert JS
    return { error: 'Authentication failed. Invalid email or password.' };
  }
}
