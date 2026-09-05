import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { sql } from './db';
import { initDatabase } from './init-db';

export type UserRole = 'ADMIN' | 'EDITOR';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sunstar-news-jwt-fallback-secret'
);

export const AUTH_COOKIE = 'sunstar_session';

export async function signToken(payload: { id: number; email: string; role: UserRole }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as { id: number; email: string; role: UserRole };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    await initDatabase(); // Auto-ensure tables exist
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.id) return null;

    const users = await sql`
      SELECT id, email, name, role FROM users WHERE id = ${payload.id} LIMIT 1
    `;

    if (users.length === 0) return null;

    const u = users[0];
    return {
      id: u.id as number,
      email: u.email as string,
      name: u.name as string,
      role: u.role as UserRole,
    };
  } catch (err) {
    console.error('Error fetching session user:', err);
    return null;
  }
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('अनधिकृत: कृपया लगइन गर्नुहोस् (Unauthorized: Please log in)');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error(
      `पहुँच अस्वीकृत: तपाईंलाई यो कार्य गर्ने अधिकार छैन (Access Denied: Requires ${allowedRoles.join(
        ' or '
      )} role)`
    );
  }

  return user;
}
