import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl && (dbUrl.startsWith('mysql://') || dbUrl.startsWith('mariadb://'))) {
      pool = mysql.createPool(dbUrl);
    } else {
      const host = process.env.MYSQL_HOST || 'localhost';
      const user = process.env.MYSQL_USER || 'root';
      const password = process.env.MYSQL_PASSWORD || '';
      const database = process.env.MYSQL_DATABASE || 'sunstar_news';
      const port = Number(process.env.MYSQL_PORT) || 3306;

      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        dateStrings: true,
      });
    }
  }
  return pool;
}

let lastDbFailureTime = 0;
const DB_OFFLINE_COOLDOWN_MS = 15000; // 15 seconds cooldown when MySQL is offline

/**
 * Server-side MySQL tagged template query function.
 * Converts template literal placeholders to MySQL '?' parameter bindings.
 * Compatible with existing sql`SELECT ...` calls across Server Actions.
 */
export async function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any[]> {
  // If MySQL failed recently (e.g. server offline), skip attempt and throw fallback error instantly
  if (Date.now() - lastDbFailureTime < DB_OFFLINE_COOLDOWN_MS) {
    throw new Error('MySQL server is offline (fallback to local JSON store)');
  }

  try {
    const p = getPool();
    const queryText = strings.reduce((acc, str, i) => acc + str + (i < values.length ? '?' : ''), '');
    const [rows] = await p.execute(queryText, values);

    // Reset failure timer on successful query
    lastDbFailureTime = 0;

    if (Array.isArray(rows)) {
      return rows;
    }
    return [rows];
  } catch (err: any) {
    const isConnRefused =
      err?.code === 'ECONNREFUSED' ||
      err?.message?.includes('ECONNREFUSED') ||
      (Array.isArray(err?.errors) && err.errors.some((e: any) => e?.code === 'ECONNREFUSED'));

    if (isConnRefused) {
      lastDbFailureTime = Date.now();
      // Print a clean, single-line notice instead of a giant 50-line stack trace
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚡ [MySQL Offline]: MySQL not running on port 3306. Using local JSON cache fallback.');
      }
    } else {
      console.error('MySQL Query Error:', err?.message || err);
    }
    throw err;
  }
}

