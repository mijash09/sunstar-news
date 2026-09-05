import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined in .env.local');
}

// Server-side Neon SQL Query Function
export const sql = neon(process.env.DATABASE_URL);
