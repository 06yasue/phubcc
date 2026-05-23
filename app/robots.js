import siteConfig from '@/config';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir bot Google biar gak ngintip halaman admin/rahasia lo
      disallow: ['/login', '/settings', '/list', '/upload'],
    },
    // Kasih tau Google posisi Sitemap Index lo
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  }
}

