'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function MonetagAds() {
  const pathname = usePathname();

  // Daftar halaman yang HARUS BERSIH dari iklan (gak bakal tembus ke sini)
  const blockedPages = ['/settings', '/upload', '/list', '/login'];

  // Cek apakah halaman yang lagi dibuka ada di dalam daftar blockedPages
  const isBlocked = blockedPages.some((page) => pathname.startsWith(page));

  // Kalo masuk halaman yg di-blacklist, return null (iklan gak dimunculin sama sekali)
  if (isBlocked) return null;

  // Kalo halamannya aman (Home, Video, dll), iklan bakal disuntik otomatis oleh Next.js
  return (
    <Script
      src="https://quge5.com/88/tag.min.js"
      data-zone="242410"
      data-cfasync="false"
      async
    />
  );
}
