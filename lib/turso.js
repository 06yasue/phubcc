import { createClient } from '@libsql/client';

// Membuat koneksi ke Turso menggunakan environment variables
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
