'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signToken, AUTH_COOKIE, UserRole } from '@/lib/auth';
import { initDatabase } from '@/lib/init-db';
import { loginLimiter } from '@/lib/rate-limit';

export async function loginAction(prevState: any, formData: FormData) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const headersList = headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  const rl = loginLimiter.check(ip);
  if (!rl.success) {
    const secs = Math.ceil(rl.retryAfterMs / 1000);
    return {
      error: `धेरै लगइन प्रयासहरू भए। ${secs} सेकेन्ड पछि पुनः प्रयास गर्नुहोस् (Too many attempts — retry in ${secs}s)`,
    };
  }
  // ──────────────────────────────────────────────────────────────────────────

  try {
    const usernameOrEmail = (
      (formData.get('username') as string) ||
      (formData.get('email') as string) ||
      ''
    ).trim();
    const password = ((formData.get('password') as string) || '').trim();

    if (!usernameOrEmail || !password) {
      return { error: 'प्रयोगकर्ता नाम र पासवर्ड आवश्यक छ (Username and password are required)' };
    }

    const cleanInput = usernameOrEmail.toLowerCase();

    let user: any = null;

    // 1. Instant match for Sitaram / Admin fallback credentials (avoids any DB connection wait)
    if (
      (cleanInput === 'sitaram' || cleanInput === 'sitaram@sunstarnews.com' || cleanInput === 'admin') &&
      (password === 'Sitaram@123' || password === 'sitaram@123' || password === 'admin123' || password === 'admin')
    ) {
      user = {
        id: 1,
        email: 'sitaram@sunstarnews.com',
        name: 'Sitaram',
        role: 'ADMIN',
      };
    }

    // 2. If not matched, query MySQL database
    if (!user) {
      try {
        await initDatabase();
        const users = await sql`
          SELECT id, email, name, username, password_hash, role 
          FROM users 
          WHERE LOWER(username) = ${cleanInput} 
             OR LOWER(email) = ${cleanInput}
             OR LOWER(name) = ${cleanInput}
          LIMIT 1
        `;
        if (users && users.length > 0) {
          const dbUser = users[0];
          const isMatch = await bcrypt.compare(password, dbUser.password_hash as string);
          if (isMatch) {
            user = dbUser;
          }
        }
      } catch (dbErr) {
        console.warn('DB query fallback during login:', dbErr);
      }
    }

    if (!user) {
      return { error: 'प्रयोगकर्ता नाम वा पासवर्ड गलत छ (Invalid username or password)' };
    }

    // Successful login → reset rate limiter for this IP
    loginLimiter.reset(ip);

    const token = await signToken({
      id: user.id as number,
      email: user.email as string,
      role: user.role as UserRole,
    });

    const cookieStore = cookies();
    cookieStore.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return { success: true, redirectUrl: '/dashboard' };
  } catch (err: any) {
    console.error('Login error:', err);
    return { error: err.message || 'लगइन गर्दा समस्या आयो' };
  }
}

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect('/login');
}


