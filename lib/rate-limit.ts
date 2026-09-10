/**
 * In-memory rate limiter using a sliding window algorithm.
 * Works in Next.js API routes & Server Actions (server-side only).
 *
 * Usage:
 *   const limiter = rateLimiter({ windowMs: 60_000, max: 10 });
 *   const { success, retryAfterMs } = limiter.check(identifier);
 */

interface RateLimiterOptions {
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number;
  /** Maximum requests allowed per window (default: 20) */
  max?: number;
}

interface RateLimiterResult {
  success: boolean;
  remaining: number;
  retryAfterMs: number;
}

interface HitRecord {
  timestamps: number[];
  blockedUntil?: number;
}

const stores = new Map<string, Map<string, HitRecord>>();

export function rateLimiter(opts: RateLimiterOptions = {}) {
  const windowMs = opts.windowMs ?? 60_000;
  const max = opts.max ?? 20;

  // Each limiter instance gets its own store keyed by a unique symbol string
  const storeKey = `${windowMs}-${max}`;
  if (!stores.has(storeKey)) {
    stores.set(storeKey, new Map());
  }
  const store = stores.get(storeKey)!;

  return {
    check(identifier: string): RateLimiterResult {
      const now = Date.now();
      let record = store.get(identifier);

      if (!record) {
        record = { timestamps: [] };
        store.set(identifier, record);
      }

      // Prune old timestamps outside the window
      record.timestamps = record.timestamps.filter((t) => t > now - windowMs);

      if (record.timestamps.length >= max) {
        const oldest = record.timestamps[0];
        const retryAfterMs = windowMs - (now - oldest);
        return { success: false, remaining: 0, retryAfterMs: Math.max(0, retryAfterMs) };
      }

      record.timestamps.push(now);
      return {
        success: true,
        remaining: max - record.timestamps.length,
        retryAfterMs: 0,
      };
    },

    /** Clear a specific identifier (e.g., after successful login) */
    reset(identifier: string) {
      store.delete(identifier);
    },
  };
}

// ── Pre-built limiters for common endpoints ──────────────────────────────────

/** Login: 5 attempts per 10 minutes per IP */
export const loginLimiter = rateLimiter({ windowMs: 10 * 60_000, max: 5 });

/** Comments: 10 per minute per IP */
export const commentLimiter = rateLimiter({ windowMs: 60_000, max: 10 });

/** Likes: 30 per minute per IP */
export const likeLimiter = rateLimiter({ windowMs: 60_000, max: 30 });

/** Dashboard API general: 120 per minute per IP */
export const dashboardLimiter = rateLimiter({ windowMs: 60_000, max: 120 });

/** Upload: 20 per 5 minutes per IP */
export const uploadLimiter = rateLimiter({ windowMs: 5 * 60_000, max: 20 });

// ── Helper: get client IP from Next.js request headers ───────────────────────
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

// ── Helper: standard rate limit error response ───────────────────────────────
export function rateLimitResponse(retryAfterMs: number) {
  const retryAfterSecs = Math.ceil(retryAfterMs / 1000);
  return new Response(
    JSON.stringify({
      success: false,
      error: `धेरै प्रयासहरू भए। ${retryAfterSecs} सेकेन्ड पछि पुनः प्रयास गर्नुहोस् (Too many requests. Retry after ${retryAfterSecs}s)`,
      retryAfter: retryAfterSecs,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSecs),
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
