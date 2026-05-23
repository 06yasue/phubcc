import { createClient } from '@libsql/client';

// Kodingan ini otomatis adaptif: 
// Kalau di Vercel, dia bakal baca Key dari dashboard Vercel.
// Kalau di laptop (localhost), dia bakal otomatis baca dari file .env.local lu.
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
